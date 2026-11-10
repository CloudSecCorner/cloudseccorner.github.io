terraform {
  required_version = ">= 1.5.0"
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}

variable "server_name" {
  type    = string
  default = "htz-hardened-cx31"
}

resource "hcloud_network" "private_network" {
  name     = "hetzner-vpc-network"
  ip_range = "10.0.0.0/16"
}

resource "hcloud_network_subnet" "subnet" {
  network_id   = hcloud_network.private_network.id
  type         = "cloud"
  network_zone = "eu-central"
  ip_range     = "10.0.1.0/24"
}

resource "hcloud_firewall" "firewall" {
  name = "hetzner-cloud-firewall"

  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = [
      "10.0.0.0/8"
    ]
  }
}

resource "hcloud_server" "server" {
  name        = var.server_name
  server_type = "cx31"
  image       = "ubuntu-24.04"
  firewall_ids = [hcloud_firewall.firewall.id]
  backups     = true

  public_net {
    ipv4_enabled = false
    ipv6_enabled = false
  }
}

resource "hcloud_server_network" "server_network" {
  server_id  = hcloud_server.server.id
  network_id = hcloud_network.private_network.id
}

output "server_id" {
  value = hcloud_server.server.id
}
