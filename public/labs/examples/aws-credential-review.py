#!/usr/bin/env python3
"""Review IAM credential-report CSV locally. No AWS requests or credential changes."""
import argparse
import csv
import io
import json
import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

NOW = datetime(2026, 11, 7, tzinfo=timezone.utc)
FIELDS = ["user", "arn", "password_enabled", "mfa_active"] + [
    f"access_key_{n}_{field}" for n in (1, 2)
    for field in ("active", "last_rotated", "last_used_date")
]


def timestamp(value):
    date = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if date.tzinfo is None:
        raise ValueError("A timestamp must include its timezone")
    return date.astimezone(timezone.utc)


def review(text, as_of, age_days=90):
    if age_days < 1:
        raise ValueError("Review interval must be positive")
    rows = csv.DictReader(io.StringIO(text))
    if not set(FIELDS).issubset(rows.fieldnames or []):
        raise ValueError("Missing required credential-report columns")
    findings = []
    seen = set()
    for row in rows:
        user = row["user"]
        if not user or user in seen or not row["arn"]:
            raise ValueError("Missing or duplicate identity")
        seen.add(user)

        def flag(code, detail):
            findings.append({"identity": user, "code": code, "detail": detail})

        for field in ["password_enabled", "mfa_active", "access_key_1_active", "access_key_2_active"]:
            if row[field].lower() not in ("true", "false"):
                raise ValueError(f"Unrecognized boolean in {field}")
        if row["password_enabled"].lower() == "true" and row["mfa_active"].lower() == "false":
            flag("CONSOLE_WITHOUT_MFA", "Review this password-enabled identity's MFA controls")
        for n in (1, 2):
            if row[f"access_key_{n}_active"].lower() != "true":
                continue
            if user == "<root_account>":
                flag("ROOT_ACCESS_KEY", f"Review active root access key slot {n}")
            for field, code in [("last_rotated", "KEY_AGE_REVIEW"), ("last_used_date", "KEY_INACTIVITY_REVIEW")]:
                value = row[f"access_key_{n}_{field}"]
                try:
                    date = timestamp(value)
                except (ValueError, AttributeError):
                    flag("KEY_EVIDENCE_UNKNOWN", f"Slot {n} {field}: unavailable evidence ({value})")
                    continue
                if date > as_of:
                    raise ValueError("Credential timestamp is later than the review timestamp")
                if as_of - date >= timedelta(days=age_days):
                    flag(code, f"Slot {n} {field} reaches the chosen {age_days}-day review threshold")
    if not seen:
        raise ValueError("Credential report contains no identities")
    return findings


def fixture(**updates):
    row = dict.fromkeys(FIELDS, "N/A")
    row.update(user="lab-operator", arn="arn:aws:iam::111122223333:user/lab-operator",
               password_enabled="false", mfa_active="false",
               access_key_1_active="false", access_key_2_active="false")
    row.update(updates)
    stream = io.StringIO()
    writer = csv.DictWriter(stream, FIELDS)
    writer.writeheader()
    writer.writerow(row)
    return stream.getvalue()


class CredentialTests(unittest.TestCase):
    def test_no_password_or_active_keys(self):
        self.assertEqual(review(fixture(), NOW), [])

    def test_console_without_mfa(self):
        self.assertEqual(review(fixture(password_enabled="true"), NOW)[0]["code"], "CONSOLE_WITHOUT_MFA")

    def test_centralized_root_without_credentials(self):
        self.assertEqual(review(fixture(user="<root_account>", arn="arn:aws:iam::111122223333:root"), NOW), [])

    def test_active_root_key(self):
        results = review(fixture(user="<root_account>", access_key_1_active="true"), NOW)
        self.assertIn("ROOT_ACCESS_KEY", {r["code"] for r in results})

    def test_old_but_recently_used_key(self):
        results = review(fixture(access_key_1_active="true", access_key_1_last_rotated="2026-01-01T00:00:00Z",
                                 access_key_1_last_used_date="2026-11-06T00:00:00Z"), NOW)
        self.assertEqual([r["code"] for r in results], ["KEY_AGE_REVIEW"])

    def test_unknown_does_not_mean_unused(self):
        results = review(fixture(access_key_1_active="true"), NOW)
        self.assertEqual({r["code"] for r in results}, {"KEY_EVIDENCE_UNKNOWN"})

    def test_inactive_key_is_not_an_active_exposure(self):
        self.assertEqual(review(fixture(access_key_1_last_rotated="2020-01-01T00:00:00Z"), NOW), [])

    def test_malformed_and_future_evidence(self):
        for text in ["user,arn\nexample,example", fixture(password_enabled="maybe"),
                     fixture(access_key_1_active="true", access_key_1_last_rotated="2030-01-01T00:00:00Z")]:
            with self.assertRaises(ValueError):
                review(text, NOW)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--as-of", help="UTC review timestamp; defaults to current time")
    parser.add_argument("--age-days", type=int, default=90, help="Local review threshold, not an AWS requirement")
    parser.add_argument("--demo", action="store_true")
    args = parser.parse_args()
    if not args.report and not args.demo:
        unittest.main(argv=[sys.argv[0]])
    else:
        try:
            text = args.report.read_text() if args.report else fixture(password_enabled="true", access_key_1_active="true")
            findings = review(text, timestamp(args.as_of) if args.as_of else datetime.now(timezone.utc), args.age_days)
            print(json.dumps({"findings": findings, "scope": "IAM credential-report fields only"}, indent=2))
            return 1 if findings else 0
        except (ValueError, OSError) as error:
            print(str(error), file=sys.stderr)
            return 2


if __name__ == "__main__":
    sys.exit(main())
