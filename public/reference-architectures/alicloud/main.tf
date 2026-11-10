terraform {
  required_version = ">= 1.5.0"
  required_providers {
    alicloud = {
      source  = "aliyun/alicloud"
      version = "~> 1.210"
    }
  }
}

variable "bucket_name" {
  type    = string
  default = "csc-secure-oss-bucket"
}

provider "alicloud" {}

resource "alicloud_oss_bucket" "documents" {
  bucket = var.bucket_name
  acl    = "private"

  server_side_encryption_rule {
    sse_algorithm = "KMS"
  }
}

output "bucket_id" {
  value = alicloud_oss_bucket.documents.id
}
