package reference.aws
import rego.v1

# Input: terraform show -json tfplan. Partial baseline check; not a full audit.
default allow := false
allow if {
  resources := [r | some r in input.resource_changes; r.type == "aws_s3_bucket_public_access_block"; r.change.after != null]
  count(resources) > 0
  every r in resources {
    r.change.after.block_public_acls == true
    r.change.after.block_public_policy == true
    r.change.after.ignore_public_acls == true
    r.change.after.restrict_public_buckets == true
  }
}
