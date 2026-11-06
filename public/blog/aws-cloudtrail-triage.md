# CloudTrail Triage Starts With Coverage and a Defensible Timeline

Reviewed: 2026-11-07

A suspicious-looking API name is a lead. To explain what happened, preserve the original event and answer which principal made the request, what it targeted, what outcome was recorded, and what remains unknown.

## Write the coverage note first

The [CloudTrail event-history view](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html) is bounded by account, region, time, and event category. A trail or other event collection must be designed around the investigation questions you need to answer. In particular, [data events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) need deliberate collection for object-level questions such as S3 reads.

An empty result can reflect a collection gap, a query limit, or the absence of one of your chosen signals. It does not establish the absence of unauthorized activity.

## Preserve distinctions during normalization

The [CloudTrail triage lab](/labs/AWS-CloudTrail-Triage) handles both trail `Records` and nested CLI lookup exports. Its eight tests cover failed requests, duplicate events, changed role bindings, root activity, and sessions that share a role without sharing a key identifier.

The review queue uses `failed_request` when the event records an error. Otherwise it says `no_error_recorded`, leaving downstream completion and intent for corroboration. The [event-record reference](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html) explains why fields must be interpreted in the context of the service and event.

## Link observations to owned decisions

| Review lead | Corroborating evidence |
| --- | --- |
| Credential creation | Target identity, owner approval, later use |
| Role-policy change | Policy diff, deployment record, intended scope |
| Logging-stop request | Recorded error, actual trail status, other collection paths |
| Function creation with a role | Deployer, requested role, trust and runtime permissions |

Keep the raw exports, evidence timestamps, analysis notes, and decision owner together. Investigate unfamiliar activity before treating it as confirmed compromise or launching destructive containment. The [AWS Defender practice path](/labs#aws-defender-path) connects this investigation work to credential, delegation, and storage reviews.
