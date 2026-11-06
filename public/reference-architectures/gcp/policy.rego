package reference.gcp
import rego.v1

# Input: terraform show -json tfplan. Partial baseline check; not a full audit.
default allow := false
allow if {
  resources := [r | some r in input.resource_changes; r.type == "google_storage_bucket"; r.change.after != null]
  count(resources) > 0
  every r in resources {
    r.change.after.uniform_bucket_level_access == true
    r.change.after.public_access_prevention == "enforced"
  }
}
