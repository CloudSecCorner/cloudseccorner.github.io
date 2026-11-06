terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
  }
}

variable "subscription_id" { type = string }
variable "storage_name" { type = string }
variable "location" {
  type    = string
  default = "eastus"
}

provider "azurerm" {
  features {}
  subscription_id     = var.subscription_id
  storage_use_azuread = true
}

resource "azurerm_resource_group" "example" {
  name     = "csc-storage-reference"
  location = var.location
}

resource "azurerm_storage_account" "documents" {
  name                            = var.storage_name
  resource_group_name             = azurerm_resource_group.example.name
  location                        = azurerm_resource_group.example.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  account_kind                    = "StorageV2"
  min_tls_version                 = "TLS1_2"
  https_traffic_only_enabled      = true
  shared_access_key_enabled       = false
  allow_nested_items_to_be_public = false
  public_network_access_enabled   = false
}

output "storage_account_id" { value = azurerm_storage_account.documents.id }
