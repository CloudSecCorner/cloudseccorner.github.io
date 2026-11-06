# Prioritize Exposure with KEV, EPSS, and Asset Evidence

Reviewed: 2026-11-06

## Keep the signals distinct

The [CISA Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) records vulnerabilities with evidence of exploitation. [FIRST EPSS](https://www.first.org/epss/) estimates the probability that a published CVE will be exploited in the next 30 days. Severity, exploitation evidence, predicted exploitation, asset applicability, and business impact are separate inputs.

An EPSS value is not the probability that your specific server will be compromised. Absence from KEV is not evidence that a vulnerability is harmless. A public service banner is not sufficient to determine patch state.

## Build a reviewable decision record

For each candidate finding, capture the affected asset and owner, installed software evidence, vendor advisory, reachable path, available credentials or privileges, business impact, mitigation, and verification plan. Timestamp external intelligence so a later review can explain why the decision changed.

| Question | Useful evidence |
| --- | --- |
| Is this version actually affected? | Vendor advisory, package/build inventory, backport information |
| Can an attacker reach the vulnerable path? | Network vantage, routing, authentication, actual service behavior |
| Is exploitation already known? | KEV entry and relevant vendor guidance |
| How should remaining work be ordered? | EPSS, severity, exposure, impact, and local confidence |
| Did the fix work? | Updated software/configuration and a repeatable verification result |

Use this as an example decision workflow, not a universal numeric scoring formula. Record compensating controls and their limits. A service removed from public access may still need patching because another trust boundary can reach it.

## Use scans to establish observations

[Nmap version detection](https://nmap.org/book/man-version-detection.html) can help identify a service, but results need confirmation. Compare the same target and vantage point before and after a change. A closed port supports a reachability conclusion; it does not establish that every copy of the vulnerable software was removed.

The [Nmap auditing lab](/labs/Nmap-Practical-Labs) creates one loopback listener, observes it, stops it, and verifies the changed port state. It demonstrates the evidence loop without scanning third-party targets or assigning invented CVE findings to a local test service.

## Close findings with an owner and evidence

Set response targets based on your actual obligations and risk process. Do not apply a federal remediation deadline universally to every organization without checking applicability. Record exceptions with an owner, expiry, and retest condition.

At closure, retain the original applicability evidence, the change, the verification output, and residual risk. Rerun relevant checks when a service becomes exposed, a vendor updates its affected-version range, or new exploitation evidence appears.
