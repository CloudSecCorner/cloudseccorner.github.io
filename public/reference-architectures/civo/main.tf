terraform {
  required_version = ">= 1.5.0"
  required_providers {
    civo = {
      source  = "civo/civo"
      version = "~> 1.0"
    }
  }
}

variable "cluster_name" {
  type    = string
  default = "civo-prod-k3s"
}

resource "civo_network" "private_network" {
  label = "civo-vpc-network"
}

resource "civo_firewall" "cluster_firewall" {
  name       = "civo-k3s-firewall"
  network_id = civo_network.private_network.id

  ingress_rule {
    label      = "https"
    protocol   = "tcp"
    port_range = "443"
    cidr       = ["10.0.0.0/8"]
    action     = "allow"
  }

  egress_rule {
    label      = "all-egress"
    protocol   = "tcp"
    port_range = "1-65535"
    cidr       = ["0.0.0.0/0"]
    action     = "allow"
  }
}

resource "civo_kubernetes_cluster" "cluster" {
  name        = var.cluster_name
  network_id  = civo_network.private_network.id
  firewall_id = civo_firewall.cluster_firewall.id
  pools {
    size       = "g4s.kube.medium"
    node_count = 3
  }
}

output "cluster_id" {
  value = civo_kubernetes_cluster.cluster.id
}
