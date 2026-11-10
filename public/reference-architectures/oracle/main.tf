terraform {
  required_version = ">= 1.5.0"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }
}

variable "compartment_ocid" {
  type = string
}

variable "bucket_name" {
  type    = string
  default = "csc-secure-bucket"
}

provider "oci" {}

data "oci_objectstorage_namespace" "ns" {
  compartment_id = var.compartment_ocid
}

resource "oci_objectstorage_bucket" "secure_bucket" {
  compartment_id = var.compartment_ocid
  name           = var.bucket_name
  namespace      = data.oci_objectstorage_namespace.ns.namespace
  access_type    = "NoPublicAccess"
  versioning     = "Enabled"
  auto_tiering   = "Disabled"
}

output "bucket_name" {
  value = oci_objectstorage_bucket.secure_bucket.name
}
