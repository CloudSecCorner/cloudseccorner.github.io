# A Private S3 Bucket Is a Contract You Can Review Before Apply

Reviewed: 2026-11-07

Make storage security concrete: identify the bucket, list the controls the application requires, and test whether a proposed change preserves them. A reusable review record is more useful than a generic claim that a bucket is secure.

## Separate confidentiality, authorization, and recovery

[SSE-S3 encryption applies by default to new object uploads](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html). That protects data at rest; it does not decide who can read it. [Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html) and [Object Ownership](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html) address different parts of storage access control.

In the accompanying example, the review contract calls for four public-access flags, disabled ACLs through `BucketOwnerEnforced`, explicit default encryption, versioning, and a scoped insecure-transport deny. These choices are a workshop baseline, not a complete assessment of every identity, service integration, or recovery requirement.

## Check resolved plan values

The [S3 plan-review lab](/labs/AWS-S3-Plan-Review) includes a downloadable Terraform configuration and a checker for its exact root-module shape. It rejects missing, ambiguous, incorrectly bound, and unresolved control values.

[Terraform distinguishes unknown planned values](https://developer.hashicorp.com/terraform/internals/json-format) from resolved values. Avoid treating an incomplete plan as affirmative evidence. Keep account, variables, source revision, provider lock file, and the saved plan together. If the deployment process later creates a different plan, the earlier review no longer establishes what will be deployed.

## Verify the application path after deployment

After an independently approved sandbox deployment, inspect the resulting bucket settings and test the application's intended read/write behavior. A denied unauthorized operation and a working authorized operation answer complementary questions.

Versioning is useful recovery material, but it does not by itself protect versions from a sufficiently privileged deletion path. Assign owners for delete permissions, retention, and recovery testing. Continue with [CloudTrail coverage](/blog/AWS-CloudTrail-Triage) so the questions you plan to investigate have corresponding event evidence.
