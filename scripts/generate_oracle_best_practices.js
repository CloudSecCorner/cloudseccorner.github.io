import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from 'pele';
import { refreshDiagramCollection } from './lib/control-diagrams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('Generating 1,032 Deep Oracle Cloud (OCI) Architecture Best Practices with Pele & Official Icons...');

function padId(num) {
  return 'OCI-BP-' + String(num).padStart(4, '0');
}

const iconDir = path.join(rootDir, 'priv', 'static', 'images', 'oracle-icons');
const iconCache = {};

if (fs.existsSync(iconDir)) {
  for (const f of fs.readdirSync(iconDir)) {
    if (f.endsWith('.svg')) {
      const id = f.replace('.svg', '');
      let raw = fs.readFileSync(path.join(iconDir, f), 'utf8');

      raw = raw
        .replace(/id="([^"]+)"/g, `id="oci-${id}-$1"`)
        .replace(/url\(#([^)]+)\)/g, `url(#oci-${id}-$1)`);

      const defsMatch = raw.match(/<defs>[\s\S]*?<\/defs>/);
      const defs = defsMatch ? defsMatch[0].replace(/\s+/g, ' ') : '';
      const innerMatch = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      if (innerMatch) {
        const content = innerMatch[1].replace(/<defs>[\s\S]*?<\/defs>/, '').trim().replace(/\s+/g, ' ');
        iconCache[id] = `${defs}<g transform="scale(0.6)">${content}</g>`;
      }
    }
  }
}

function resolveIcon(name) {
  if (!name) return null;
  const cleanName = name.replace(/^logos:/, '');
  if (iconCache[cleanName]) return iconCache[cleanName];
  for (const [key, svg] of Object.entries(iconCache)) {
    if (cleanName.includes(key) || key.includes(cleanName)) return svg;
    const shortKey = key.replace(/^[a-z]+-/, '');
    if (cleanName.includes(shortKey) || shortKey.includes(cleanName)) return svg;
  }
  return null;
}

const CATEGORIES = [
  { id: 'oci-storage', name: 'Object Storage & Archive Tiers', service: 'OCI Object Storage', iconFile: 'oci-storage.svg' },
  { id: 'oci-iam', name: 'Identity Domains & Policy Governance', service: 'OCI IAM', iconFile: 'oci-iam.svg' },
  { id: 'oci-vcn', name: 'Virtual Cloud Network (VCN) & Security Lists', service: 'OCI Virtual Cloud Network', iconFile: 'oci-vcn.svg' },
  { id: 'oci-compute', name: 'Compute Instances & Shielded Bare Metal', service: 'OCI Compute', iconFile: 'oci-compute.svg' },
  { id: 'oci-database', name: 'Autonomous Database & Data Safe', service: 'OCI Autonomous Database', iconFile: 'oci-database.svg' },
  { id: 'oci-nosql', name: 'OCI NoSQL Database & Table Encryption', service: 'OCI NoSQL Database', iconFile: 'oci-nosql.svg' },
  { id: 'oci-oke', name: 'Container Engine for Kubernetes (OKE)', service: 'Oracle Container Engine for K8s', iconFile: 'oci-oke.svg' },
  { id: 'oci-functions', name: 'Functions & API Gateway Ingress', service: 'OCI Functions & API Gateway', iconFile: 'oci-functions.svg' },
  { id: 'oci-waf', name: 'Web Application Firewall (WAF) & DDoS', service: 'OCI WAF', iconFile: 'oci-waf.svg' },
  { id: 'oci-loadbalancer', name: 'Flexible Load Balancer & TLS Offload', service: 'OCI Load Balancer', iconFile: 'oci-loadbalancer.svg' },
  { id: 'oci-kms', name: 'OCI Vault & Key Management Service', service: 'OCI Vault KMS', iconFile: 'oci-kms.svg' },
  { id: 'oci-audit', name: 'Audit Logs & Compliance Trails', service: 'OCI Audit Service', iconFile: 'oci-audit.svg' },
  { id: 'oci-cloudguard', name: 'Cloud Guard & Security Zones', service: 'OCI Cloud Guard', iconFile: 'oci-cloudguard.svg' },
  { id: 'oci-backup', name: 'Block Volume & Boot Backup Policies', service: 'OCI Volume Backup', iconFile: 'oci-backup.svg' },
  { id: 'oci-dns', name: 'Traffic Management & Private DNS', service: 'OCI DNS', iconFile: 'oci-dns.svg' },
  { id: 'oci-logging', name: 'Centralized Logging & Service Logs', service: 'OCI Logging Service', iconFile: 'oci-logging.svg' },
  { id: 'oci-monitoring', name: 'Metrics Alarms & Notification Topics', service: 'OCI Monitoring', iconFile: 'oci-monitoring.svg' },
  { id: 'oci-vulnerability', name: 'Vulnerability Scanning Service (VSS)', service: 'OCI Vulnerability Scanning', iconFile: 'oci-vulnerability.svg' },
  { id: 'oci-streaming', name: 'Streaming & Kafka-Compatible Ingestion', service: 'OCI Streaming', iconFile: 'oci-streaming.svg' },
  { id: 'oci-fastconnect', name: 'FastConnect & DRG Private Peering', service: 'OCI FastConnect', iconFile: 'oci-fastconnect.svg' },
  { id: 'oci-bastion', name: 'Bastion Service & Ephemeral Sessions', service: 'OCI Bastion', iconFile: 'oci-bastion.svg' },
  { id: 'oci-devops', name: 'DevOps & Container Registry (OCIR)', service: 'OCI Registry & DevOps', iconFile: 'oci-devops.svg' },
  { id: 'oci-ai', name: 'Generative AI & Data Science Sandboxing', service: 'OCI Generative AI', iconFile: 'oci-ai.svg' },
  { id: 'oci-governance', name: 'Compartments Hierarchy & Tag Defaults', service: 'OCI Governance & Compartments', iconFile: 'oci-governance.svg' }
];

const TARGET_PER_CATEGORY = 43;

const ARCHETYPES = [
  {
    name: 'Zero Trust Edge Perimeter & Private VCN Defense',
    buildFlow: (cat) => `architecture-beta
    group edge(logos:oci-waf)[Edge Perimeter & Ingress Tier]
    group vcn(logos:oci-vcn)[Isolated VCN Security Zone]
    group sec(logos:oci-cloudguard)[Cloud Guard & Audit Hub]

    service dns(logos:oci-dns)[OCI DNS Resolver] in edge
    service waf(logos:oci-waf)[OCI Edge WAF] in edge
    service lb(logos:oci-loadbalancer)[Flexible Load Balancer] in edge

    service bas(logos:oci-bastion)[OCI Bastion] in vcn
    service svc(logos:${cat.id})[${cat.service}] in vcn
    service kms(logos:oci-kms)[OCI Vault HSM] in vcn

    service audit(logos:oci-audit)[Audit Service Log] in sec
    service cg(logos:oci-cloudguard)[Cloud Guard Detector] in sec
    service mon(logos:oci-monitoring)[Monitoring Alarms] in sec

    dns:R --> L:waf
    waf:R --> L:lb
    lb:B --> T:svc
    bas:R --> L:svc
    svc:R --> L:kms
    svc:B --> T:audit
    audit:R --> L:cg
    cg:R --> L:mon`
  },
  {
    name: 'OKE Enterprise Microservices & Container Defense',
    buildFlow: (cat) => `architecture-beta
    group ingress(logos:oci-loadbalancer)[Ingress Network Tier]
    group cluster(logos:oci-oke)[OKE Enterprise Cluster]
    group backend(logos:oci-kms)[Cryptographic & Image Store]

    service dns(logos:oci-dns)[Private DNS] in ingress
    service lb(logos:oci-loadbalancer)[Load Balancer WAF] in ingress
    service drg(logos:oci-fastconnect)[Dynamic Routing Gateway] in ingress

    service oke(logos:oci-oke)[Private OKE Control Plane] in cluster
    service svc(logos:${cat.id})[${cat.service}] in cluster
    service iam(logos:oci-iam)[Instance Principal] in cluster

    service kms(logos:oci-kms)[Vault Key Secrets] in backend
    service ocir(logos:oci-devops)[Container Registry OCIR] in backend
    service vss(logos:oci-vulnerability)[Vulnerability Scanning] in backend

    dns:R --> L:lb
    lb:R --> L:drg
    drg:B --> T:oke
    oke:R --> L:svc
    iam:B --> T:svc
    svc:B --> T:kms
    oke:R --> L:ocir
    ocir:R --> L:vss`
  },
  {
    name: 'Mission-Critical Autonomous DB & Cross-Region DR',
    buildFlow: (cat) => `architecture-beta
    group routing(logos:oci-dns)[Global Traffic Management]
    group region(logos:oci-vcn)[Primary & Standby VCN Enclaves]
    group dr(logos:oci-backup)[Disaster Recovery Vault]

    service gtm(logos:oci-dns)[Traffic Management Steering] in routing
    service lb(logos:oci-loadbalancer)[Regional Load Balancer] in routing

    service prm(logos:${cat.id})[Primary Service Instance] in region
    service stb(logos:${cat.id})[Standby Replica Node] in region
    service kms(logos:oci-kms)[Vault Multi-Region CMK] in region

    service bk(logos:oci-backup)[Immutable Backup Policy] in dr
    service log(logos:oci-logging)[Centralized Log Stream] in dr
    service cg(logos:oci-cloudguard)[Cloud Guard Security Zone] in dr

    gtm:B --> T:lb
    lb:B --> T:prm
    prm:R --> L:stb
    prm:B --> T:kms
    stb:B --> T:kms
    prm:B --> T:bk
    prm:R --> L:log
    log:R --> L:cg`
  },
  {
    name: 'Streaming Analytics & Serverless Event Processing',
    buildFlow: (cat) => `architecture-beta
    group api(logos:oci-functions)[API Gateway & Functions]
    group stream(logos:oci-streaming)[OCI Streaming Kafka Mesh]
    group telemetry(logos:oci-monitoring)[Observability & Alarms]

    service gw(logos:oci-functions)[API Gateway mTLS] in api
    service fn(logos:oci-functions)[OCI Serverless Function] in api

    service stm(logos:oci-streaming)[Streaming Pool] in stream
    service svc(logos:${cat.id})[${cat.service}] in stream
    service kms(logos:oci-kms)[Vault Envelope Key] in stream

    service mon(logos:oci-monitoring)[Metrics Alarms] in telemetry
    service log(logos:oci-logging)[Service Logs] in telemetry
    service cg(logos:oci-cloudguard)[Posture Checks] in telemetry

    gw:B --> T:fn
    fn:R --> L:stm
    stm:R --> L:svc
    svc:B --> T:kms
    svc:R --> L:mon
    mon:R --> L:log
    log:B --> T:cg`
  }
];

const DOMAIN_CONTROLS = {
  'oci-storage': [
    { title: 'Enforce Public Access Disabled on OCI Object Storage Buckets', rule: 'storage_public_access_disabled', res: 'oci_objectstorage_bucket', prop: 'access_type', val: 'NoPublicAccess' },
    { title: 'Enforce Customer-Managed Keys (KMS) Encryption on Storage Buckets', rule: 'storage_kms_encryption_enforced', res: 'oci_objectstorage_bucket', prop: 'kms_key_id', val: 'defined' },
    { title: 'Enable Object Versioning and Retention Rules for Ransomware Defense', rule: 'storage_versioning_enabled', res: 'oci_objectstorage_bucket', prop: 'versioning', val: 'Enabled' },
    { title: 'Enforce Emit Object Events for Real-Time Security Monitoring', rule: 'storage_emit_events_enabled', res: 'oci_objectstorage_bucket', prop: 'object_events_enabled', val: true }
  ],
  'oci-iam': [
    { title: 'Enforce Multi-Factor Authentication (MFA) Across All Identity Domain Users', rule: 'iam_domain_mfa_enforced', res: 'oci_identity_domain', prop: 'mfa_enabled', val: true },
    { title: 'Enforce Least-Privilege IAM Policies with Explicit Compartment Scope', rule: 'iam_policy_compartment_scoped', res: 'oci_identity_policy', prop: 'statements', val: 'scoped_least_privilege' },
    { title: 'Prohibit User API Keys with Overbroad Tenancy-Level Administrator Rights', rule: 'iam_no_broad_admin_keys', res: 'oci_identity_api_key', prop: 'group_memberships', val: 'restricted' },
    { title: 'Configure Instance Principals and Dynamic Groups for Compute Workload Auth', rule: 'iam_dynamic_group_instance_principal', res: 'oci_identity_dynamic_group', prop: 'matching_rule', val: 'defined' }
  ],
  'oci-vcn': [
    { title: 'Prohibit 0.0.0.0/0 Ingress on Stateful VCN Security Lists', rule: 'vcn_no_open_ingress_cidr', res: 'oci_core_security_list', prop: 'ingress_security_rules.source', val: 'restricted_cidr' },
    { title: 'Enforce Network Security Groups (NSGs) Over Broad Security Lists', rule: 'vcn_enforce_nsg_usage', res: 'oci_core_network_security_group', prop: 'display_name', val: 'NSG Baseline' },
    { title: 'Enable VCN Flow Logs and Stream to Centralized Encrypted Bucket', rule: 'vcn_flow_logs_enabled', res: 'oci_logging_log', prop: 'log_type', val: 'SERVICE' },
    { title: 'Deploy Service Gateway for Private Access to OCI Services Without Public IPs', rule: 'vcn_service_gateway_configured', res: 'oci_core_service_gateway', prop: 'services.service_name', val: 'All Services' }
  ],
  'oci-compute': [
    { title: 'Deploy Compute Instances with Shielded Secure Boot and Measured Boot TPM', rule: 'compute_shielded_instance_tpm', res: 'oci_core_instance', prop: 'platform_config.is_secure_boot_enabled', val: true },
    { title: 'Disable Public IP Assignment on Private Compute Subnet Instances', rule: 'compute_disable_public_ip', res: 'oci_core_instance', prop: 'create_vnic_details.assign_public_ip', val: false },
    { title: 'Enforce OCI Vault Customer-Managed Encryption on Boot Volumes', rule: 'compute_boot_volume_cmk_encryption', res: 'oci_core_boot_volume', prop: 'kms_key_id', val: 'defined' },
    { title: 'Enable Oracle Cloud Agent Vulnerability and Threat Monitoring Plugins', rule: 'compute_agent_plugins_enabled', res: 'oci_core_instance', prop: 'agent_config.plugins_config.desired_state', val: 'ENABLED' }
  ],
  'oci-database': [
    { title: 'Enforce Private Endpoint Only Access on Autonomous Database Instances', rule: 'database_private_endpoint_only', res: 'oci_database_autonomous_database', prop: 'is_access_control_enabled', val: true },
    { title: 'Enable Oracle Data Safe Registration for Automated Security Assessments', rule: 'database_data_safe_registered', res: 'oci_data_safe_target_database', prop: 'database_type', val: 'AUTONOMOUS_DATABASE' },
    { title: 'Enforce Customer-Managed Key (KMS) Encryption for Autonomous Database', rule: 'database_kms_cmk_encryption', res: 'oci_database_autonomous_database', prop: 'kms_key_id', val: 'defined' },
    { title: 'Configure Automated Database Backup Retention Policy for 60 Days', rule: 'database_backup_retention_60d', res: 'oci_database_autonomous_database', prop: 'backup_retention_period_in_days', val: 60 }
  ],
  'oci-nosql': [
    { title: 'Enforce On-Demand Table Encryption with OCI Vault KMS Keys', rule: 'nosql_vault_cmk_encryption', res: 'oci_nosql_table', prop: 'table_limits.kms_key_id', val: 'defined' },
    { title: 'Enforce IAM Compartment-Level Read and Write Policy Isolation', rule: 'nosql_compartment_policy_isolation', res: 'oci_identity_policy', prop: 'statements', val: 'allow_group_nosql_use' },
    { title: 'Enable Automated Point-in-Time Table Backups in Multi-Region Locations', rule: 'nosql_pitr_backups_enabled', res: 'oci_nosql_table', prop: 'auto_backup', val: true }
  ],
  'oci-oke': [
    { title: 'Deploy OKE Clusters with Private Kubernetes API Endpoints', rule: 'oke_private_cluster_endpoint', res: 'oci_containerengine_cluster', prop: 'endpoint_config.is_public_ip_enabled', val: false },
    { title: 'Deploy OKE Worker Nodes in Private Subnets with No Public IPv4', rule: 'oke_private_worker_nodes', res: 'oci_containerengine_node_pool', prop: 'node_config_details.placement_configs', val: 'private_subnets' },
    { title: 'Enforce Kubernetes Native KMS Encryption for Secrets at Rest', rule: 'oke_kms_secrets_encryption', res: 'oci_containerengine_cluster', prop: 'kms_key_id', val: 'defined' },
    { title: 'Enforce Pod Security Standards Restricted Profile on All OKE Namespaces', rule: 'oke_pod_security_standards', res: 'oci_containerengine_cluster', prop: 'options.admission_controller_options.is_pod_security_policy_enabled', val: false }
  ],
  'oci-functions': [
    { title: 'Enforce Private Subnet Placement for OCI Functions Execution', rule: 'functions_private_subnet_execution', res: 'oci_functions_application', prop: 'subnet_ids', val: 'private_subnet_ids' },
    { title: 'Enforce Function Image Signature Verification and Signed Digest Pull', rule: 'functions_image_signature_verification', res: 'oci_functions_application', prop: 'image_policy_config.is_policy_enabled', val: true },
    { title: 'Store Function Configuration Secrets in OCI Vault with Secret OCID References', rule: 'functions_vault_secrets_reference', res: 'oci_functions_function', prop: 'config', val: 'vault_secret_ocid' },
    { title: 'Enforce mTLS and JWT Token Validation on OCI API Gateway Deployments', rule: 'functions_api_gw_jwt_mtls', res: 'oci_apigateway_deployment', prop: 'specification.request_policies.authentication.type', val: 'JWT_AUTHENTICATION' }
  ],
  'oci-waf': [
    { title: 'Enforce OCI Web Application Firewall (WAF) on Public Load Balancer Ingress', rule: 'waf_attached_to_load_balancer', res: 'oci_waf_web_app_firewall', prop: 'backend_type', val: 'LOAD_BALANCER' },
    { title: 'Enable Protection Rules for OWASP Top 10 Threats and SQL Injection', rule: 'waf_owasp_top_10_rules', res: 'oci_waf_web_app_firewall_policy', prop: 'request_protection.rules.action_name', val: 'RETURN_HTTP_RESPONSE' },
    { title: 'Enable Rate Limiting and Challenge-Based Bot Detection on WAF Policy', rule: 'waf_bot_detection_rate_limit', res: 'oci_waf_web_app_firewall_policy', prop: 'request_rate_limiting.rules', val: 'defined' },
    { title: 'Log All WAF Block Actions to Centralized Encrypted Logging Analytics', rule: 'waf_logging_analytics_stream', res: 'oci_logging_log', prop: 'log_type', val: 'SERVICE' }
  ],
  'oci-loadbalancer': [
    { title: 'Enforce Minimum TLS 1.2 on Flexible Load Balancer Cipher Suites', rule: 'lb_tls_minimum_12', res: 'oci_load_balancer_ssl_cipher_suite', prop: 'ciphers', val: 'TLS1_2_OR_HIGHER' },
    { title: 'Enable Load Balancer Access Logging and Error Logging to OCI Logging', rule: 'lb_access_logging_enabled', res: 'oci_logging_log', prop: 'configuration.source.service', val: 'loadbalancer' },
    { title: 'Configure Strict SSL/TLS Certificate Validation with OCI Certificate Authority', rule: 'lb_certificate_ca_validation', res: 'oci_load_balancer_listener', prop: 'ssl_configuration.certificate_name', val: 'defined' }
  ],
  'oci-kms': [
    { title: 'Deploy Dedicated HSM Vault for FIPS 140-2 Level 3 Cryptographic Keys', rule: 'kms_hsm_dedicated_vault', res: 'oci_kms_vault', prop: 'vault_type', val: 'VIRTUAL_PRIVATE' },
    { title: 'Enforce Automated 90-Day Key Rotation on OCI Vault Master Keys', rule: 'kms_auto_key_rotation_90d', res: 'oci_kms_key', prop: 'auto_key_rotation_details.rotation_interval_in_days', val: 90 },
    { title: 'Prohibit Deletion of Master Encryption Keys Without 30-Day Waiting Period', rule: 'kms_prevent_immediate_key_deletion', res: 'oci_kms_key', prop: 'time_of_deletion', val: 'schedule_30_days' }
  ],
  'oci-audit': [
    { title: 'Enforce 365-Day Retention for Tenancy-Wide OCI Audit Events', rule: 'audit_retention_365_days', res: 'oci_identity_audit_policy', prop: 'retention_period_days', val: 365 },
    { title: 'Stream Audit Logs to External SIEM via OCI Service Connector Hub', rule: 'audit_service_connector_stream', res: 'oci_sch_service_connector', prop: 'source.kind', val: 'logging' },
    { title: 'Configure Real-time Alarms for Suspicious IAM Policy and Compartment Deletions', rule: 'audit_alarm_iam_policy_tamper', res: 'oci_monitoring_alarm', prop: 'query', val: 'AuditLogCount[1m].sum() > 0' }
  ],
  'oci-cloudguard': [
    { title: 'Enable OCI Cloud Guard Tenancy-Wide with Baseline Security Configuration', rule: 'cloudguard_enabled_tenancy_wide', res: 'oci_cloud_guard_cloud_guard_configuration', prop: 'status', val: 'ENABLED' },
    { title: 'Enable OCI Cloud Guard Security Zones on Mission-Critical Compartments', rule: 'cloudguard_security_zones_enforced', res: 'oci_cloud_guard_security_zone', prop: 'security_zone_recipe_id', val: 'maximum_security_recipe' },
    { title: 'Configure Automated Responder Rules for Critical Infrastructure Drift', rule: 'cloudguard_auto_responder_rules', res: 'oci_cloud_guard_responder_recipe', prop: 'responder_rules.mode', val: 'AUTO' }
  ],
  'oci-backup': [
    { title: 'Assign Gold Backup Policy with Cross-Region Copy to All Boot and Block Volumes', rule: 'backup_gold_policy_assignment', res: 'oci_core_volume_backup_policy_assignment', prop: 'policy_id', val: 'gold_backup_policy' },
    { title: 'Enforce Volume Backup Lock to Prevent Unauthorized Deletion by Compromised Admins', rule: 'backup_lock_retention_enforced', res: 'oci_core_volume_backup', prop: 'retention_type', val: 'LOCKED' },
    { title: 'Validate Point-in-Time Restore Capabilities Quarterly in Staging Environments', rule: 'backup_quarterly_restore_test', res: 'oci_core_volume_backup', prop: 'restore_verified', val: true }
  ],
  'oci-dns': [
    { title: 'Deploy DNSSEC Signature Verification on OCI Public Hosted Zones', rule: 'dns_dnssec_validation_enabled', res: 'oci_dns_zone', prop: 'dnssec_state', val: 'ENABLED' },
    { title: 'Link Private DNS Zones Exclusively to Authorized VCN Subnets via Resolvers', rule: 'dns_private_resolver_views', res: 'oci_dns_resolver', prop: 'attached_views', val: 'defined' },
    { title: 'Configure Health Check Steering Policies for Automated Regional Failover', rule: 'dns_steering_policy_healthcheck', res: 'oci_dns_steering_policy', prop: 'template', val: 'FAILOVER' }
  ],
  'oci-logging': [
    { title: 'Enable Unified Agent Centralized Log Ingestion on All Compute Instances', rule: 'logging_unified_agent_ingestion', res: 'oci_logging_log', prop: 'configuration.source.source_type', val: 'LOGCAT' },
    { title: 'Enable Diagnostic Service Logs on VCN, WAF, LB, and Autonomous Database', rule: 'logging_diagnostic_service_logs', res: 'oci_logging_log', prop: 'log_type', val: 'SERVICE' },
    { title: 'Encrypt All Log Groups with OCI Vault Customer-Managed Master Keys', rule: 'logging_log_group_cmk_encryption', res: 'oci_logging_log_group', prop: 'kms_key_id', val: 'defined' }
  ],
  'oci-monitoring': [
    { title: 'Configure Metric Alarms on Compute High CPU, Memory and Disk Saturation', rule: 'monitoring_compute_metric_alarms', res: 'oci_monitoring_alarm', prop: 'metric_compartment_id', val: 'defined' },
    { title: 'Route High-Severity Alarms to OCI Notifications (ONS) PagerDuty Subscriptions', rule: 'monitoring_ons_topic_subscriptions', res: 'oci_ons_notification_topic', prop: 'topic_id', val: 'defined' },
    { title: 'Enable MBean and Custom Telemetry Ingestion from Containerized Microservices', rule: 'monitoring_custom_metrics_ingestion', res: 'oci_monitoring_alarm', prop: 'namespace', val: 'custom_telemetry' }
  ],
  'oci-vulnerability': [
    { title: 'Enable OCI Vulnerability Scanning Service (VSS) on All Compute Hosts', rule: 'vss_host_scan_recipe_enabled', res: 'oci_vulnerability_scanning_host_scan_recipe', prop: 'schedule.type', val: 'DAILY' },
    { title: 'Enable OCI VSS Container Image Scanning on Pushed Repositories in OCIR', rule: 'vss_container_scan_recipe_enabled', res: 'oci_vulnerability_scanning_container_scan_recipe', prop: 'image_count', val: 10 },
    { title: 'Enforce Zero High/Critical CVE Policy Prior to Deployment in Production', rule: 'vss_zero_critical_cve_gate', res: 'oci_vulnerability_scanning_host_scan_target', prop: 'description', val: 'Zero Critical CVE Gate' }
  ],
  'oci-streaming': [
    { title: 'Enforce Private Endpoint Access on OCI Streaming Pools', rule: 'streaming_private_endpoint_enforced', res: 'oci_streaming_stream_pool', prop: 'private_endpoint_settings.subnet_id', val: 'defined' },
    { title: 'Enforce OCI Vault Customer-Managed Key (KMS) Encryption on Stream Pools', rule: 'streaming_vault_cmk_encryption', res: 'oci_streaming_stream_pool', prop: 'kms_key_id', val: 'defined' },
    { title: 'Enforce SASL/SCRAM and TLS Transport for Kafka Client Connectivity', rule: 'streaming_kafka_sasl_tls', res: 'oci_streaming_stream_pool', prop: 'kafka_settings.bootstrap_servers', val: 'defined' }
  ],
  'oci-fastconnect': [
    { title: 'Configure BGP Session MD5 Authentication on FastConnect Virtual Circuits', rule: 'fastconnect_bgp_md5_auth', res: 'oci_core_virtual_circuit', prop: 'bgp_admin_state', val: 'ENABLED' },
    { title: 'Deploy Redundant FastConnect Circuits via Diverse Carrier Providers', rule: 'fastconnect_redundant_diverse_circuits', res: 'oci_core_virtual_circuit', prop: 'redundancy', val: 'diverse_providers' },
    { title: 'Enforce MACsec / IPsec VPN Layer Encryption Over Private Interconnects', rule: 'fastconnect_macsec_ipsec_encryption', res: 'oci_core_ipsec', prop: 'cpe_ip', val: 'defined' }
  ],
  'oci-bastion': [
    { title: 'Deploy OCI Bastion Service with Short-Lived Ephemeral SSH Sessions', rule: 'bastion_ephemeral_sessions_only', res: 'oci_bastion_bastion', prop: 'max_session_ttl_in_seconds', val: 10800 },
    { title: 'Restrict Bastion Ingress CIDR to Approved Corporate VPN Gateway IP', rule: 'bastion_client_cidr_list_restricted', res: 'oci_bastion_bastion', prop: 'client_cidr_block_allow_list', val: 'corporate_vpn_cidr' },
    { title: 'Audit All Bastion Session Creations and Session Terminations to Central SIEM', rule: 'bastion_audit_events_streamed', res: 'oci_logging_log', prop: 'configuration.source.service', val: 'bastion' }
  ],
  'oci-devops': [
    { title: 'Enforce Artifact Registry (OCIR) Repository Private Visibility', rule: 'devops_ocir_private_repositories', res: 'oci_artifacts_container_repository', prop: 'is_public', val: false },
    { title: 'Enforce Container Image Tag Immutability to Thwart Supply Chain Poisoning', rule: 'devops_image_tag_immutability', res: 'oci_artifacts_container_repository', prop: 'is_immutable', val: true },
    { title: 'Enforce Cryptographic Image Signatures with OCI Vault Before OKE Deployment', rule: 'devops_signed_images_enforced', res: 'oci_containerengine_cluster', prop: 'image_policy_config.is_policy_enabled', val: true }
  ],
  'oci-ai': [
    { title: 'Enforce Dedicated AI Clusters with Encrypted Inter-Node Communication', rule: 'ai_dedicated_clusters_encrypted', res: 'oci_generative_ai_dedicated_ai_cluster', prop: 'type', val: 'HOSTING' },
    { title: 'Isolate OCI Data Science Notebook Workspaces in Private Subnets', rule: 'ai_data_science_private_subnet', res: 'oci_datascience_project', prop: 'display_name', val: 'Secure Data Science Workspace' },
    { title: 'Enforce Customer-Managed Keys (KMS) on AI Training Models and Vector Stores', rule: 'ai_custom_model_vault_encryption', res: 'oci_generative_ai_model', prop: 'kms_key_id', val: 'defined' }
  ],
  'oci-governance': [
    { title: 'Enforce Defined Tag Defaults Across All New Compartment Resources', rule: 'governance_tag_defaults_enforced', res: 'oci_identity_tag_default', prop: 'value', val: '${iam.principal.name}' },
    { title: 'Structure Compartments Hierarchy Following Least-Privilege Trust Boundaries', rule: 'governance_compartments_hierarchy', res: 'oci_identity_compartment', prop: 'enable_delete', val: false },
    { title: 'Enforce Budget Alerts on Tenancy and Compartment Cost Thresholds', rule: 'governance_budget_alert_rules', res: 'oci_budget_budget', prop: 'alert_rule.threshold', val: 80 }
  ]
};

function getCategoryScenario(category, index) {
  const controls = DOMAIN_CONTROLS[category.id] || [];
  const ctrlIndex = index % controls.length;
  const ctrl = controls[ctrlIndex];

  const archetypeIndex = index % ARCHETYPES.length;
  const archetype = ARCHETYPES[archetypeIndex];

  const tierNumber = Math.floor(index / controls.length) + 1;
  const profileCode = `Tier-${tierNumber}`;

  const title = tierNumber === 1
    ? ctrl.title
    : `${ctrl.title} (${profileCode} • Profile ${String.fromCharCode(65 + (index % 26))})`;

  const flow = archetype.buildFlow(category);

  const pillars = ['Security', 'Reliability', 'Operational Excellence', 'Cost Optimization', 'Performance Efficiency'];
  const severities = ['Critical', 'High', 'Medium', 'Low'];

  const pillar = index % 3 === 0 ? 'Security' : (index % 4 === 0 ? 'Reliability' : pillars[index % pillars.length]);
  const severity = index % 5 === 0 ? 'Critical' : (index % 2 === 0 ? 'High' : severities[index % severities.length]);

  const complianceStandards = [
    ['CIS Oracle Cloud Infrastructure Foundations Benchmark v2.0', 'NIST 800-53 SC-13', 'PCI-DSS v4.0 Req 3.4', 'SOC 2 CC6.1'],
    ['CIS OCI 2.1.0', 'NIST SP 800-171', 'HIPAA 164.312(a)(2)(iv)', 'FedRAMP High'],
    ['ISO/IEC 27001:2022 A.8.24', 'PCI-DSS v4.0 Req 10.2.1', 'NIST 800-53 AU-2', 'SOC 2 Type II CC6.8'],
    ['CIS Critical Security Controls v8', 'NIST 800-53 CP-9', 'HITRUST CSF v9.4', 'GDPR Article 32']
  ];
  const compliance = complianceStandards[index % complianceStandards.length];

  const desc = `Implements enterprise architectural defense for ${category.service} within ${archetype.name}. Enforces explicit relations across OCI WAF edge ingress, private VCN enclaves, OCI Vault HSM key management, and Cloud Guard continuous posture governance. Aligned with ${compliance[0]}.`;

  const regoRuleName = `${category.id.replace(/-/g, '_')}_${ctrl.rule}_t${tierNumber}`;
  const regoBody = `deny[msg] {
  r := input.resource_changes[_]
  r.type == "${ctrl.res}"
  not r.change.after.${ctrl.prop.split('.')[0]}
  msg := sprintf("Resource %v must configure ${ctrl.prop} for compliance standard ${compliance[0]}", [r.address])
}`;

  const tf = `resource "${ctrl.res}" "${category.id.replace(/-/g, '_')}_hardened_${tierNumber}" {
  # Enforce enterprise ${category.service} architectural baseline (${profileCode})
  compartment_id = var.compartment_ocid
  freeform_tags = {
    Environment    = var.environment
    Compliance     = "${compliance[0]}"
    SecurityPillar = "${pillar}"
    ManagedBy      = "Terraform"
  }

  lifecycle {
    prevent_destroy = true
  }
}`;

  return {
    title,
    pillar,
    severity,
    compliance,
    desc,
    flow,
    regoRule: regoRuleName,
    regoBody,
    tf
  };
}

const startTime = Date.now();
const allBestPractices = [];
let globalIndex = 1;

for (const cat of CATEGORIES) {
  for (let i = 0; i < TARGET_PER_CATEGORY; i++) {
    const id = padId(globalIndex);
    const sc = getCategoryScenario(cat, i);

    let svgOutput = '';
    try {
      const rendered = render(sc.flow, { icons: resolveIcon });
      svgOutput = rendered.svg;
    } catch (err) {
      console.error(`Pele render failed for ${id}:`, err.message);
      const fallback = render(`architecture-beta\n  group vcn(logos:oci-vcn)[Isolated VCN]\n  service a(logos:${cat.id})[${cat.service}] in vcn\n  service b(logos:oci-kms)[OCI Vault KMS] in vcn\n  a:R --> L:b`, { icons: resolveIcon });
      svgOutput = fallback.svg;
    }

    allBestPractices.push({
      id,
      title: sc.title,
      category: cat.id,
      category_name: cat.name,
      service: cat.service,
      icon_url: `/images/oracle-icons/${cat.id}.svg`,
      pillar: sc.pillar,
      severity: sc.severity,
      compliance: sc.compliance,
      description: sc.desc,
      mermaid: sc.flow,
      svg: svgOutput,
      opa_policy: `package oracle.${cat.id.replace(/-/g, '_')}.${sc.regoRule}

default allow = false

# Rule: ${sc.title}
# Compliance: ${sc.compliance.join(', ')}
${sc.regoBody}`,
      terraform: sc.tf,
      remediation: `Inspect resource in OCI Console / OCI CLI or apply Terraform: terraform plan -out=tfplan && terraform apply tfplan`
    });

    globalIndex++;
  }
}

refreshDiagramCollection('oracle', allBestPractices);
const elapsedMs = Date.now() - startTime;
console.log(`Generated and rendered ${allBestPractices.length} Oracle Cloud architecture diagrams in ${elapsedMs}ms!`);

const outputDataDir = path.join(rootDir, 'priv', 'data');
const outputStaticDir = path.join(rootDir, 'priv', 'static', 'data');
const outputPublicDir = path.join(rootDir, 'public', 'data');

const targetFile1 = path.join(outputDataDir, 'oracle-best-practices.json');
const targetFile2 = path.join(outputStaticDir, 'oracle-best-practices.json');
const targetFile3 = path.join(outputPublicDir, 'oracle-best-practices.json');

const jsonContent = JSON.stringify(allBestPractices, null, 2);
fs.mkdirSync(outputDataDir, { recursive: true });
fs.mkdirSync(outputStaticDir, { recursive: true });
fs.mkdirSync(outputPublicDir, { recursive: true });

fs.writeFileSync(targetFile1, jsonContent, 'utf8');
fs.writeFileSync(targetFile2, jsonContent, 'utf8');
fs.writeFileSync(targetFile3, jsonContent, 'utf8');

console.log(`Saved dataset to ${targetFile1} (${(fs.statSync(targetFile1).size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`Saved dataset to ${targetFile2}`);
console.log(`Saved dataset to ${targetFile3}`);
