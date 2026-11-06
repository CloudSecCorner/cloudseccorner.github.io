# Review the Deployment Identity, the Function, and the Role Together

Reviewed: 2026-11-07

A developer may be unable to read an application dataset directly while still being able to deploy code that reads it. That gap between direct access and delegated execution deserves its own review.

## Draw the three permission relationships

Start with three separate questions: what may the deployer configure, which service may assume the execution role, and what may that role do at runtime? [AWS PassRole guidance](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html) explains delegation to an AWS service. It is not interchangeable with role trust or the runtime policy.

For a small Lambda application, name the expected role and function explicitly. Review whether the PassRole grant is scoped to that role and appropriate destination service, whether the service trust is intentional, and whether deployment actions expose unrelated functions. The [Lambda execution-role reference](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) documents how Lambda uses that role.

## Treat code changes as an access path

Restricting new role assignments does not remove access through existing functions. A principal that can replace code on a privileged function may use the role already attached to it. Include update permissions and ownership boundaries in the review, then inspect the runtime role's actual resource access.

The [role-delegation lab](/labs/AWS-Role-Delegation) turns several of these checks into a small structural contract. Its mutation tests catch broad role scope, missing service restrictions, unrelated function access, and extra trusted principals. The result is a review aid, not proof of effective authorization across every policy layer.

## Connect policy review with recorded behavior

Keep the deployer, target function, expected execution role, change approval, and evidence identifiers in one review record. [IAM policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) depends on the applicable policy types and request context; do not infer the full result from one allow statement.

For operational evidence, inspect the service action that created or modified the resource receiving the role. Continue with the [CloudTrail investigation guide](/blog/AWS-CloudTrail-Triage) and compare observed changes with the reviewed deployment contract.
