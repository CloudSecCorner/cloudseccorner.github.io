package reference.azure
import rego.v1

# Input: terraform show -json tfplan. Partial baseline check; not a full audit.
default allow := false
allow if {
  resources := [r | some r in input.resource_changes; r.type == "azurerm_storage_account"; r.change.after != null]
  count(resources) > 0
  every r in resources {
    r.change.after.public_network_access_enabled == false
    r.change.after.shared_access_key_enabled == false
    r.change.after.allow_nested_items_to_be_public == false
    r.change.after.https_traffic_only_enabled == true
    r.change.after.min_tls_version == "TLS1_2"
  }
}
