terraform {
  required_version = ">= 1.5.0"
  required_providers {
    vultr = {
      source  = "vultr/vultr"
      version = "~> 2.20"
    }
  }
}

variable "label" {
  type    = string
  default = "csc-secure-storage"
}

provider "vultr" {}

resource "vultr_object_storage" "documents" {
  cluster_id = 1
  label      = var.label
}

output "s3_hostname" {
  value = vultr_object_storage.documents.s3_hostname
}
