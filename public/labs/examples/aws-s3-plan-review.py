#!/usr/bin/env python3
"""Lint a root-module S3 Terraform plan against this lab's explicit contract."""
import argparse
import json
import sys
import unittest
from pathlib import Path

BUCKET = "aws_s3_bucket.data"
FLAGS = ["block_public_acls", "ignore_public_acls", "block_public_policy", "restrict_public_buckets"]


def contains_unknown(value):
    if isinstance(value, dict):
        return any(contains_unknown(v) for v in value.values())
    if isinstance(value, list):
        return any(contains_unknown(v) for v in value)
    return value is True


def unknown_at(value, path):
    if value is True:
        return True
    if not path:
        return contains_unknown(value)
    key, *rest = path
    if isinstance(value, dict):
        child = value.get(key)
    elif isinstance(value, list) and isinstance(key, int) and key < len(value):
        child = value[key]
    else:
        child = None
    return unknown_at(child, rest)


def review(plan):
    if str(plan.get("format_version", "")).split(".")[0] != "1":
        raise ValueError("This exercise supports Terraform plan JSON format 1.x")
    changes = {r["address"]: r for r in plan.get("resource_changes", []) if r.get("mode", "managed") == "managed"}
    target = changes.get(BUCKET, {}).get("change", {})
    bucket = target.get("after") or {}
    if (not isinstance(bucket.get("bucket"), str) or not bucket["bucket"]
            or contains_unknown(target.get("after_unknown", {}).get("bucket"))):
        return ["TARGET_BUCKET_UNRESOLVED"]
    name = bucket["bucket"]
    issues = []

    def control(kind, fields):
        matches = []
        for address, resource in changes.items():
            if resource.get("type") == kind and not address.startswith("module."):
                matches.append(resource.get("change", {}))
        if len(matches) != 1 or not matches[0].get("after"):
            issues.append(f"MISSING_OR_AMBIGUOUS:{kind}")
            return {}
        change = matches[0]
        if any(unknown_at(change.get("after_unknown", {}), (field,) if isinstance(field, str) else field)
               for field in ["bucket", *fields]):
            issues.append(f"UNRESOLVED:{kind}")
            return {}
        if change["after"].get("bucket") != name:
            issues.append(f"BUCKET_BINDING:{kind}")
            return {}
        return change["after"]

    public = control("aws_s3_bucket_public_access_block", FLAGS)
    if not all(public.get(flag) is True for flag in FLAGS):
        issues.append("PUBLIC_ACCESS_FLAGS")
    ownership = control("aws_s3_bucket_ownership_controls", [("rule", 0, "object_ownership")])
    if ownership.get("rule") != [{"object_ownership": "BucketOwnerEnforced"}]:
        issues.append("ACL_OWNERSHIP")
    encryption = control("aws_s3_bucket_server_side_encryption_configuration", [("rule", 0, "apply_server_side_encryption_by_default", 0, "sse_algorithm")])
    rules = encryption.get("rule") or [{}]
    if rules[0].get("apply_server_side_encryption_by_default", [{}])[0].get("sse_algorithm") != "AES256":
        issues.append("EXPLICIT_SSE_S3_BASELINE")
    versioning = control("aws_s3_bucket_versioning", [("versioning_configuration", 0, "status")])
    versions = versioning.get("versioning_configuration") or []
    if len(versions) != 1 or versions[0].get("status") != "Enabled":
        issues.append("VERSIONING")
    policy = control("aws_s3_bucket_policy", ["policy"])
    try:
        statements = json.loads(policy.get("policy", "{}" )).get("Statement", [])
        if isinstance(statements, dict):
            statements = [statements]
        expected = {f"arn:aws:s3:::{name}", f"arn:aws:s3:::{name}/*"}
        def tls_deny(s):
            condition = s.get("Condition", {}).get("Bool", {})
            resources = s.get("Resource", [])
            resources = resources if isinstance(resources, list) else [resources]
            return (s.get("Effect") == "Deny" and s.get("Principal") == "*" and s.get("Action") == "s3:*"
                    and set(resources) == expected and set(condition) == {"aws:SecureTransport", "aws:PrincipalIsAWSService"}
                    and all(v is False or v == "false" for v in condition.values())
                    and set(s).issubset({"Sid", "Effect", "Principal", "Action", "Resource", "Condition"}))
        if not any(tls_deny(s) for s in statements):
            issues.append("TLS_DENY_CONTRACT")
    except (ValueError, TypeError, AttributeError):
        issues.append("TLS_POLICY_INVALID")
    return sorted(set(issues))


def sample():
    name = "amzn-s3-demo-csc-evidence"
    policy = {"Version": "2012-10-17", "Statement": [{
        "Sid": "DenyInsecureTransport", "Effect": "Deny", "Principal": "*", "Action": "s3:*",
        "Resource": [f"arn:aws:s3:::{name}", f"arn:aws:s3:::{name}/*"],
        "Condition": {"Bool": {"aws:SecureTransport": "false", "aws:PrincipalIsAWSService": "false"}}
    }]}
    resources = [
        ("aws_s3_bucket", "data", {"bucket": name}),
        ("aws_s3_bucket_public_access_block", "private", dict.fromkeys(FLAGS, True)),
        ("aws_s3_bucket_ownership_controls", "owner", {"rule": [{"object_ownership": "BucketOwnerEnforced"}]}),
        ("aws_s3_bucket_server_side_encryption_configuration", "encryption", {"rule": [{"apply_server_side_encryption_by_default": [{"sse_algorithm": "AES256"}]}]}),
        ("aws_s3_bucket_versioning", "versions", {"versioning_configuration": [{"status": "Enabled"}]}),
        ("aws_s3_bucket_policy", "transport", {"policy": json.dumps(policy)}),
    ]
    plan = {"format_version": "1.2", "resource_changes": [
        {"address": f"{kind}.{label}", "mode": "managed", "type": kind,
         "change": {"actions": ["create"], "after": {"bucket": name, **after}, "after_unknown": {}}}
        for kind, label, after in resources
    ]}
    # AWS provider 6.x computes these optional fields even though our required
    # algorithm/status values are already known. They must not hide a real pass.
    plan["resource_changes"][3]["change"]["after_unknown"] = {"rule": [{
        "bucket_key_enabled": True, "blocked_encryption_types": True,
        "apply_server_side_encryption_by_default": [{"kms_master_key_id": True}]
    }]}
    plan["resource_changes"][4]["change"]["after_unknown"] = {"versioning_configuration": [{"mfa_delete": True}]}
    return plan


class PlanTests(unittest.TestCase):
    def test_explicit_baseline(self):
        self.assertEqual(review(sample()), [])

    def test_each_public_flag(self):
        for flag in FLAGS:
            plan = sample()
            plan["resource_changes"][1]["change"]["after"][flag] = False
            self.assertIn("PUBLIC_ACCESS_FLAGS", review(plan))

    def test_unknown_is_not_a_pass(self):
        cases = [(1, {FLAGS[0]: True}),
                 (3, {"rule": [{"apply_server_side_encryption_by_default": [{"sse_algorithm": True}]}]}),
                 (4, {"versioning_configuration": [{"status": True}]})]
        for index, unknown in cases:
            plan = sample()
            plan["resource_changes"][index]["change"]["after_unknown"] = unknown
            self.assertTrue(any(x.startswith("UNRESOLVED:") for x in review(plan)))

    def test_controls_for_another_bucket_do_not_count(self):
        plan = sample()
        plan["resource_changes"][1]["change"]["after"]["bucket"] = "a-different-lab-bucket"
        self.assertIn("PUBLIC_ACCESS_FLAGS", review(plan))

    def test_missing_or_deleted_controls(self):
        for index in range(1, 6):
            plan = sample()
            plan["resource_changes"][index]["change"]["after"] = None
            self.assertTrue(review(plan))

    def test_http_deny_must_cover_bucket_and_objects(self):
        plan = sample()
        resource = plan["resource_changes"][-1]["change"]["after"]
        policy = json.loads(resource["policy"])
        policy["Statement"][0]["Resource"].pop()
        resource["policy"] = json.dumps(policy)
        self.assertIn("TLS_DENY_CONTRACT", review(plan))

    def test_versioning_and_ownership(self):
        for index in (2, 4):
            plan = sample()
            plan["resource_changes"][index]["change"]["after"] = {"bucket": "amzn-s3-demo-csc-evidence", "rule": []}
            self.assertTrue(review(plan))

    def test_unsupported_plan_or_empty_target(self):
        with self.assertRaises(ValueError):
            review({"format_version": "2.0"})
        plan = sample()
        plan["resource_changes"][0]["change"]["after"] = None
        self.assertEqual(review(plan), ["TARGET_BUCKET_UNRESOLVED"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan", type=Path)
    parser.add_argument("--sample", action="store_true")
    args = parser.parse_args()
    if args.sample:
        print(json.dumps(sample(), indent=2))
    elif args.plan:
        try:
            issues = review(json.loads(args.plan.read_text()))
            print(json.dumps({"findings": issues, "scope": "Named root-module bucket and explicit lab contract only"}, indent=2))
            return 1 if issues else 0
        except (ValueError, KeyError, TypeError, AttributeError, IndexError, OSError) as error:
            print(str(error), file=sys.stderr)
            return 2
    else:
        unittest.main(argv=[sys.argv[0]])


if __name__ == "__main__":
    sys.exit(main())
