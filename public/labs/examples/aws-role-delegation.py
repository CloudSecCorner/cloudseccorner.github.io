#!/usr/bin/env python3
"""Lint one Lambda deployment contract. This is not an IAM authorization simulator."""
import argparse
import copy
import fnmatch
import json
import re
import sys
import unittest
from pathlib import Path

ROLE = "arn:aws:iam::111122223333:role/csc-runtime"
FUNCTION = "arn:aws:lambda:us-east-1:111122223333:function:csc-ingest"


def values(value):
    return value if isinstance(value, list) else [value]


def statements(policy):
    entries = policy.get("Statement", [])
    entries = values(entries)
    if not entries or not all(isinstance(s, dict) for s in entries):
        raise ValueError("Expected nonempty policy statements")
    return entries


def review(bundle, role=ROLE, function=FUNCTION):
    role_match = re.fullmatch(r"arn:aws:iam::(\d{12}):role/[A-Za-z0-9+=,.@_/-]+", role)
    function_match = re.fullmatch(r"arn:aws:lambda:[a-z0-9-]+:(\d{12}):function:[A-Za-z0-9_-]+", function)
    if not role_match or not function_match or role_match[1] != function_match[1]:
        raise ValueError("Use exact commercial-partition role and function ARNs in the same account")
    findings = []
    found_passrole = False
    for statement in statements(bundle["deployment_policy"]):
        if statement.get("Effect") == "Deny":
            continue
        if statement.get("Effect") != "Allow" or "NotAction" in statement or "NotResource" in statement:
            findings.append("MANUAL_POLICY_REVIEW")
            continue
        actions = values(statement.get("Action", []))
        resources = values(statement.get("Resource", []))
        if not actions or not resources or not all(isinstance(a, str) for a in actions):
            raise ValueError("Expected actions and resources")
        grants = lambda action: any(fnmatch.fnmatchcase(action.lower(), a.lower()) for a in actions)
        if grants("iam:PassRole"):
            found_passrole = True
            if resources != [role]:
                findings.append("PASSROLE_SCOPE")
            condition = statement.get("Condition", {}).get("StringEquals", {})
            if values(condition.get("iam:PassedToService", [])) != ["lambda.amazonaws.com"]:
                findings.append("PASSROLE_SERVICE")
        if any(grants(action) for action in ["lambda:CreateFunction", "lambda:UpdateFunctionCode", "lambda:UpdateFunctionConfiguration"]):
            if resources != [function]:
                findings.append("DEPLOYMENT_SCOPE")
    if not found_passrole:
        findings.append("MISSING_PASSROLE_CONTRACT")
    trusted = []
    for statement in statements(bundle["role_trust"]):
        if statement.get("Effect") == "Deny":
            continue
        if (statement.get("Effect") != "Allow" or statement.get("Principal") != {"Service": "lambda.amazonaws.com"}
                or values(statement.get("Action", [])) != ["sts:AssumeRole"]
                or "NotPrincipal" in statement):
            findings.append("TRUST_PRINCIPAL")
        else:
            trusted.append(statement)
    if not trusted:
        findings.append("MISSING_SERVICE_TRUST")
    return sorted(set(findings))


def sample():
    return {
        "deployment_policy": {"Version": "2012-10-17", "Statement": [
            {"Effect": "Allow", "Action": "iam:PassRole", "Resource": ROLE,
             "Condition": {"StringEquals": {"iam:PassedToService": "lambda.amazonaws.com"}}},
            {"Effect": "Allow", "Action": ["lambda:CreateFunction", "lambda:UpdateFunctionCode"], "Resource": FUNCTION}
        ]},
        "role_trust": {"Version": "2012-10-17", "Statement": [
            {"Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}
        ]}
    }


class DelegationTests(unittest.TestCase):
    def test_narrow_contract(self):
        self.assertEqual(review(sample()), [])

    def test_wildcard_role(self):
        data = sample()
        data["deployment_policy"]["Statement"][0]["Resource"] = "*"
        self.assertIn("PASSROLE_SCOPE", review(data))

    def test_wildcard_action_still_needs_review(self):
        data = sample()
        data["deployment_policy"]["Statement"][0]["Action"] = "*"
        self.assertIn("DEPLOYMENT_SCOPE", review(data))

    def test_missing_or_wrong_service(self):
        for value in [None, "ec2.amazonaws.com"]:
            data = sample()
            data["deployment_policy"]["Statement"][0]["Condition"]["StringEquals"]["iam:PassedToService"] = value
            self.assertIn("PASSROLE_SERVICE", review(data))

    def test_code_update_scope_is_separate(self):
        data = sample()
        data["deployment_policy"]["Statement"][1]["Resource"] = "*"
        self.assertIn("DEPLOYMENT_SCOPE", review(data))

    def test_extra_trusted_principal(self):
        data = sample()
        data["role_trust"]["Statement"].append({"Effect": "Allow", "Principal": {"AWS": "*"}, "Action": "sts:AssumeRole"})
        self.assertIn("TRUST_PRINCIPAL", review(data))

    def test_deny_does_not_hide_a_broad_allow(self):
        data = sample()
        broad = copy.deepcopy(data["deployment_policy"]["Statement"][0])
        broad["Resource"] = "*"
        data["deployment_policy"]["Statement"].extend([broad, {"Effect": "Deny", "Action": "*", "Resource": "*"}])
        self.assertIn("PASSROLE_SCOPE", review(data))

    def test_complement_policy_requires_manual_review(self):
        data = sample()
        data["deployment_policy"]["Statement"].append({"Effect": "Allow", "NotAction": "iam:*", "Resource": "*"})
        self.assertIn("MANUAL_POLICY_REVIEW", review(data))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path)
    parser.add_argument("--sample", action="store_true")
    parser.add_argument("--role-arn", default=ROLE)
    parser.add_argument("--function-arn", default=FUNCTION)
    args = parser.parse_args()
    if args.sample:
        print(json.dumps(sample(), indent=2))
    elif args.bundle:
        try:
            findings = review(json.loads(args.bundle.read_text()), args.role_arn, args.function_arn)
            print(json.dumps({"findings": findings, "scope": "Structural contract only; effective AWS access not evaluated"}, indent=2))
            return 1 if findings else 0
        except (ValueError, KeyError, TypeError, AttributeError, OSError) as error:
            print(str(error), file=sys.stderr)
            return 2
    else:
        unittest.main(argv=[sys.argv[0]])


if __name__ == "__main__":
    sys.exit(main())
