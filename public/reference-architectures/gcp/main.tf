terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = { source = "hashicorp/google", version = "~> 7.0" }
  }
}

variable "project_id" { type = string }
variable "bucket_name" { type = string }
variable "location" {
  type    = string
  default = "US"
}

provider "google" { project = var.project_id }

resource "google_storage_bucket" "documents" {
  name                        = var.bucket_name
  location                    = var.location
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false
  versioning { enabled = true }
}

output "bucket_name" { value = google_storage_bucket.documents.name }
