terraform {
  required_version = ">= 1.5.0"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.30"
    }
  }
}

variable "region" {
  type    = string
  default = "nyc3"
}

variable "name" {
  type    = string
  default = "csc-secure-spaces"
}

provider "digitalocean" {}

resource "digitalocean_spaces_bucket" "documents" {
  name   = var.name
  region = var.region
  acl    = "private"

  versioning {
    enabled = true
  }
}

output "bucket_urn" {
  value = digitalocean_spaces_bucket.documents.urn
}
