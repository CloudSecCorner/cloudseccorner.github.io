#!/usr/bin/env python3
"""Build a local CloudTrail review queue. Findings are investigation leads, not compromise verdicts."""
import argparse
import copy
import gzip
import json
import sys
import unittest
from datetime import datetime
from pathlib import Path

SIGNALS = {
    ("iam.amazonaws.com", "CreateAccessKey"): "CREDENTIAL_CREATED",
    ("iam.amazonaws.com", "AttachRolePolicy"): "ROLE_POLICY_ATTACHED",
    ("iam.amazonaws.com", "PutRolePolicy"): "INLINE_ROLE_POLICY_CHANGED",
    ("iam.amazonaws.com", "UpdateAssumeRolePolicy"): "ROLE_TRUST_CHANGED",
    ("cloudtrail.amazonaws.com", "StopLogging"): "TRAIL_LOGGING_STOP_REQUEST",
    ("cloudtrail.amazonaws.com", "DeleteTrail"): "TRAIL_DELETE_REQUEST",
    ("s3.amazonaws.com", "PutBucketPolicy"): "BUCKET_POLICY_CHANGED",
    ("lambda.amazonaws.com", "CreateFunction"): "FUNCTION_ROLE_BINDING",
    ("lambda.amazonaws.com", "UpdateFunctionConfiguration"): "FUNCTION_CONFIGURATION_CHANGED",
    ("lambda.amazonaws.com", "UpdateFunctionCode"): "FUNCTION_CODE_CHANGED",
}

LAMBDA_NAMES = {
    "CreateFunction20150331": "CreateFunction",
    "UpdateFunctionConfiguration20150331v2": "UpdateFunctionConfiguration",
    "UpdateFunctionCode20150331v2": "UpdateFunctionCode",
}


def unpack(data):
    if not isinstance(data, dict):
        raise ValueError("Expected a CloudTrail JSON object")
    if "Records" in data:
        events = data["Records"]
    elif "Events" in data:
        events = [json.loads(wrapper["CloudTrailEvent"]) for wrapper in data["Events"]]
    else:
        raise ValueError("Expected Records or lookup-events Events")
    if not isinstance(events, list) or not all(isinstance(e, dict) for e in events):
        raise ValueError("Expected an array of event records")
    return events


def triage(events):
    seen = {}
    queue = []
    for event in events:
        for key in ["eventID", "eventTime", "eventSource", "eventName", "userIdentity"]:
            if not event.get(key):
                raise ValueError(f"Missing event field: {key}")
        date = datetime.fromisoformat(event["eventTime"].replace("Z", "+00:00"))
        if date.tzinfo is None:
            raise ValueError("CloudTrail timestamps must include timezone")
        event_id = event["eventID"]
        if event_id in seen:
            if seen[event_id] != event:
                raise ValueError("Conflicting records share the same eventID")
            continue
        seen[event_id] = event
        identity = event["userIdentity"]
        if not isinstance(identity, dict):
            raise ValueError("Invalid userIdentity")
        reasons = []
        action = (LAMBDA_NAMES.get(event["eventName"], event["eventName"])
                  if event["eventSource"] == "lambda.amazonaws.com" else event["eventName"])
        signal = SIGNALS.get((event["eventSource"], action))
        if signal:
            reasons.append(signal)
        if identity.get("type") == "Root":
            reasons.append("ROOT_ACTIVITY")
        if not reasons:
            continue
        queue.append({
            "event_id": event_id, "time": date.isoformat(), "region": event.get("awsRegion", "unknown"),
            "action": event["eventName"], "api_action": action, "reasons": reasons,
            "outcome": "failed_request" if event.get("errorCode") or event.get("errorMessage") else "no_error_recorded",
            "principal": identity.get("arn") or identity.get("principalId", "unknown"),
            "session_key_id": identity.get("accessKeyId"),
            "issuer_role": identity.get("sessionContext", {}).get("sessionIssuer", {}).get("arn"),
            "requested_role": (event.get("requestParameters") or {}).get("role"),
        })
    return sorted(queue, key=lambda row: (datetime.fromisoformat(row["time"]), row["event_id"]))


def sample():
    identity = {"type": "AssumedRole", "arn": "arn:aws:sts::111122223333:assumed-role/csc-deployer/session-a",
                "accessKeyId": "LAB_SESSION_A", "sessionContext": {"sessionIssuer": {
                    "arn": "arn:aws:iam::111122223333:role/csc-deployer"}}}
    return {"Records": [
        {"eventID": "lab-event-1", "eventTime": "2026-11-07T09:00:00Z", "eventSource": "lambda.amazonaws.com",
         "eventName": "CreateFunction20150331", "awsRegion": "us-east-1", "userIdentity": identity,
         "requestParameters": {"role": "arn:aws:iam::111122223333:role/csc-runtime"}},
        {"eventID": "lab-event-2", "eventTime": "2026-11-07T09:01:00Z", "eventSource": "cloudtrail.amazonaws.com",
         "eventName": "StopLogging", "awsRegion": "us-east-1", "userIdentity": identity,
         "errorCode": "AccessDenied", "requestParameters": {"name": "lab-trail"}},
    ]}


class TriageTests(unittest.TestCase):
    def test_records_and_nested_lookup_format(self):
        records = sample()["Records"]
        wrapped = {"Events": [{"CloudTrailEvent": json.dumps(e)} for e in records]}
        self.assertEqual(triage(unpack(wrapped)), triage(unpack(sample())))

    def test_denied_stop_is_not_a_successful_stop(self):
        self.assertEqual(triage(unpack(sample()))[1]["outcome"], "failed_request")
        records = unpack(sample())
        records[1].pop("errorCode")
        records[1]["errorMessage"] = "The request was denied"
        self.assertEqual(triage(records)[1]["outcome"], "failed_request")

    def test_role_binding_is_visible_without_a_passrole_event(self):
        row = triage(unpack(sample()))[0]
        self.assertEqual(row["requested_role"], "arn:aws:iam::111122223333:role/csc-runtime")
        self.assertEqual(row["reasons"], ["FUNCTION_ROLE_BINDING"])

    def test_duplicate_event_ids_are_deduplicated(self):
        records = unpack(sample())
        self.assertEqual(len(triage(records + records)), 2)

    def test_versioned_lambda_names_preserve_raw_evidence(self):
        for name, api in LAMBDA_NAMES.items():
            event = copy.deepcopy(sample()["Records"][0])
            event["eventName"] = name
            row = triage([event])[0]
            self.assertEqual(row["action"], name)
            self.assertEqual(row["api_action"], api)
            event["eventSource"] = "unrelated.amazonaws.com"
            self.assertEqual(triage([event]), [])

    def test_conflicting_duplicate_is_rejected(self):
        records = unpack(sample())
        changed = copy.deepcopy(records[0])
        changed["eventName"] = "DeleteFunction"
        with self.assertRaises(ValueError):
            triage(records + [changed])

    def test_shared_role_is_not_a_shared_session(self):
        records = unpack(sample())
        records[1]["userIdentity"] = copy.deepcopy(records[1]["userIdentity"])
        records[1]["userIdentity"]["accessKeyId"] = "LAB_SESSION_B"
        rows = triage(records)
        self.assertEqual(rows[0]["issuer_role"], rows[1]["issuer_role"])
        self.assertNotEqual(rows[0]["session_key_id"], rows[1]["session_key_id"])

    def test_root_activity_and_order(self):
        records = unpack(sample())
        records[0]["userIdentity"] = {"type": "Root", "arn": "arn:aws:iam::111122223333:root"}
        self.assertIn("ROOT_ACTIVITY", triage(list(reversed(records)))[0]["reasons"])

    def test_missing_evidence_and_non_signal(self):
        with self.assertRaises(ValueError):
            triage([{"eventID": "incomplete"}])
        event = copy.deepcopy(sample()["Records"][0])
        event["eventName"] = "ListFunctions"
        self.assertEqual(triage([event]), [])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--events", type=Path, nargs="+", help="JSON or .json.gz CloudTrail exports")
    parser.add_argument("--sample", action="store_true")
    args = parser.parse_args()
    if args.sample:
        print(json.dumps(sample(), indent=2))
    elif args.events:
        try:
            records = []
            for file in args.events:
                opener = gzip.open if file.suffix == ".gz" else open
                with opener(file, "rt", encoding="utf-8") as stream:
                    records.extend(unpack(json.load(stream)))
            print(json.dumps({"review_queue": triage(records), "scope": "Only supplied events and named detection rules"}, indent=2))
        except (ValueError, KeyError, TypeError, AttributeError, OSError) as error:
            print(str(error), file=sys.stderr)
            return 2
    else:
        unittest.main(argv=[sys.argv[0]])


if __name__ == "__main__":
    sys.exit(main())
