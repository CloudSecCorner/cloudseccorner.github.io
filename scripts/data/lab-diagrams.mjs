export const labDiagrams = {
  'aws-credential-review.md': [
    `flowchart LR
      iam@{ icon: "logos:iam-access", label: "AWS IAM: authorized credential report", h: 64 }
      iam -->|CSV and generation timestamp| local[Local evidence review]
      local -->|Unknown evidence remains unknown| queue[Review queue with credential owner]
      queue --> change[Approved replacement or retirement decision]
      change --> verify[Fresh evidence and dependency verification]
      note[Local exercise makes no AWS calls] -.-> local`
  ],
  'aws-role-delegation.md': [
    `flowchart LR
      deployer[Deployment principal and its policies] -->|PassRole and deployment action review| function
      function@{ icon: "logos:aws-serverless-lambda", label: "Approved Lambda function", h: 64 }
      trust@{ icon: "logos:iam-access", label: "Execution role: service trust", h: 64 }
      function -->|Lambda assumes role| trust
      trust --> permissions[Runtime identity policies and applicable guardrails]
      permissions --> data[Approved application resources]
      code[Existing function code-update access is a separate path] -.-> function`
  ],
  'aws-s3-plan-review.md': [
    `flowchart LR
      source[Terraform source and locked provider] -->|Plan; no apply| plan[Saved plan JSON]
      plan --> gate[Review known bucket-bound control values]
      gate --> approved[Separate deployment approval and saved-plan apply]
      approved --> bucket
      bucket@{ icon: "logos:aws-storage-s3", label: "Private application bucket", h: 64 }
      bucket --> verify[Authorized API inspection and access tests]
      note[Offline tests validate the contract, not a deployed AWS account] -.-> gate`
  ],
  'aws-cloudtrail-triage.md': [
    `flowchart LR
      logs@{ icon: "logos:aws-logging-cloudtrail", label: "Owned CloudTrail evidence", h: 64 }
      logs -->|Raw exports and collection scope| parser[Normalize and deduplicate events]
      parser --> queue[Review leads with request outcome and session identity]
      queue --> analyst[Corroborate change record and current resource state]
      analyst --> response[Owned response decision and evidence retention]
      gap[Missing data-event coverage limits object-access conclusions] -.-> analyst`
  ],
  'NMAP-Practical-Labs.md': [
    `flowchart LR
      scope[Confirm approved hosts and scan window] --> discovery[Host discovery with recorded scope]
      discovery --> ports[Map TCP and UDP states separately]
      ports --> versions[Probe service versions with bounded retries]
      versions --> validate[Validate findings; select relevant NSE scripts]
      validate --> harden[Restrict exposed listeners and firewall rules]
      harden --> retest[Repeat scan and compare saved results]`,
    `flowchart TB
      scanner@{ icon: "logos:container-docker", label: "Authorized Nmap scanner", h: 64 }
      target@{ icon: "logos:container-docker", label: "Lab target: 172.28.0.10", h: 64 }
      scanner -->|Docker bridge; target container IP| target
      target -->|TCP 80| web[Nginx lab listener]
      target -->|TCP 2222| ssh[SSH lab listener]
      target -->|TCP 8080| mock[Python HTTP lab service]
      host[Host published ports] -.->|8080 maps to target 80| web
      host -.->|8888 maps to target 8080| mock
      observer[Optional packet capture or IDS] -.->|Observes copied traffic; not an inline hop| target
      note[Host port numbers differ from container scan ports] -.-> target`,
    `sequenceDiagram
      autonumber
      participant Scanner as Authorized Nmap scanner
      participant Open as Open TCP listener
      participant Closed as Closed TCP port
      participant Filter as Filtering device
      Note over Scanner,Open: Connect scan -sT completes the TCP handshake
      Scanner->>Open: SYN
      Open-->>Scanner: SYN-ACK
      Scanner->>Open: ACK, followed by connection close or reset
      Note over Scanner,Open: SYN scan -sS requires raw-packet privileges
      Scanner->>Open: SYN
      Open-->>Scanner: SYN-ACK
      Scanner->>Open: RST, handshake not completed
      Scanner->>Closed: SYN
      Closed-->>Scanner: RST-ACK, report closed
      Scanner->>Filter: SYN to filtered target
      Note over Scanner,Filter: Drop: no reply after retries, or applicable ICMP error, report filtered`
  ],
  'agentic-cloud-security.md': [
    `flowchart TB
      operator[Authenticated operator or signed alert] --> gateway[Ingress authentication and request limits]
      gateway --> agent[Agent orchestrator]
      retrieval[Untrusted retrieved documents] -.->|Context, never authorization| agent
      agent -->|Proposed tool call| proxy[Tool proxy validates schema and target scope]
      proxy --> policy{External policy allows action?}
      policy -->|No| deny[Deny and record decision]
      policy -->|Yes| approval{Approval required?}
      approval -->|Yes| human[Obtain action-bound human approval]
      approval -->|No| broker[Issue short-lived scoped credentials]
      human --> broker
      sandbox@{ icon: "logos:container-docker", label: "Constrained executor; local lab simulates isolation", h: 64 }
      broker --> sandbox
      target@{ icon: "logos:k8s-apiserver", label: "Approved API or mock target", h: 64 }
      sandbox -->|Allowlisted operation and egress| target
      audit@{ icon: "logos:aws-logging-cloudtrail", label: "Decision and execution audit evidence", h: 64 }
      proxy -.-> audit
      sandbox -.-> audit`,
    `flowchart TD
      input[Operator request and untrusted context] --> model[Agent proposes a tool and arguments]
      model --> schema{Tool name and schema valid?}
      schema -->|No| deny[Reject call; record reason]
      schema -->|Yes| policy{Identity, target, operation and budget allowed?}
      policy -->|No| deny
      policy -->|Yes| approval{Required approval is present and bound to this action?}
      approval -->|No| wait[Request approval; do not execute]
      approval -->|Yes or not required| token[Acquire short-lived least-privilege token]
      token --> executor[Execute with explicit timeout and egress limits]
      executor --> result[Validate result; redact sensitive fields]
      result --> evidence[Return bounded result and append audit evidence]
      deny -.-> evidence
      wait -.-> evidence`
  ],
  'Zero-Trust-Architecture.md': [
    `flowchart TB
      spire[SPIRE Server: attestation and SVID signing] -->|Attested agent session| agent[SPIRE Agent and Workload API]
      agent -->|SDS identity and trust bundle updates| clientproxy[Client Envoy]
      agent -->|SDS identity and trust bundle updates| serverproxy[Server Envoy]
      client@{ icon: "logos:k8s-pod", label: "Frontend workload", h: 64 }
      backend@{ icon: "logos:k8s-pod", label: "Payment API workload", h: 64 }
      client --> clientproxy
      clientproxy -->|mTLS with peer identity verification| serverproxy
      serverproxy -->|Authorization query| opa[Local OPA decision engine]
      opa -->|Allow or deny| serverproxy
      serverproxy -->|Allowed requests only| backend
      backend -->|Authenticated database connection| db[Data store]
      bundles[Signed policy bundle distribution] -.-> opa
      agent -.->|Workload attestation over local socket| client`,
    `sequenceDiagram
      autonumber
      participant Agent as SPIRE Agent
      participant Server as SPIRE Server
      participant Client as Client Envoy
      participant Proxy as Server Envoy
      participant OPA as Local authorization policy
      participant API as Payment API
      Agent->>Server: Authenticate attested node, request authorized workload SVIDs
      Server-->>Agent: Short-lived SVIDs and trust material
      Client->>Agent: Subscribe to SDS credentials and trust bundles
      Agent-->>Client: Identity, private key and bundle updates
      Note over Agent,Proxy: Server Envoy obtains its own identity through its local agent
      Client->>Proxy: Begin TLS handshake
      Proxy-->>Client: Exchange certificates and complete mutual authentication
      Note over Client,Proxy: Validate certificate chains and expected SPIFFE identities
      Client->>Proxy: HTTP request over established mTLS channel
      Proxy->>OPA: Evaluate peer identity, method, path and request context
      alt Explicitly allowed
        OPA-->>Proxy: Allow
        Proxy->>API: Forward authorized request
        API-->>Proxy: Application response
        Proxy-->>Client: Response over mTLS
      else Denied or policy error
        OPA-->>Proxy: Deny or evaluation failure
        Proxy-->>Client: Reject request without calling backend
      end`
  ],
  'Security-Engineering-Fundamentals.md': [
    `flowchart TB
      runner[Isolated build runner] -->|Build and push image digest| registry[OCI artifact registry]
      runner --> sbom[Generate SBOM and build provenance]
      signer@{ icon: "logos:container-cosign", label: "Cosign: trusted CI identity", h: 64 }
      sbom --> signer
      signer -->|Publish digest-bound signatures and attestations| registry
      deploy[Deployment request with immutable digest] --> verifier[Admission signature and policy verifier]
      registry -->|Image metadata and verification material| verifier
      verifier -->|Allow only after verification| app[Runtime application]
      kms@{ icon: "logos:aws-security-kms", label: "AWS KMS: key policy and data-key operations", h: 64 }
      app -->|Authorized GenerateDataKey or Decrypt| kms
      app -->|Ciphertext and wrapped data key| db[Encrypted application data store]
      note[Signing alone does not establish a SLSA build level] -.-> verifier`,
    `sequenceDiagram
      autonumber
      participant CI as Trusted build workflow
      participant Registry as OCI registry
      participant Signer as Cosign with CI identity
      participant Admission as Admission verifier
      participant App as Runtime application
      participant KMS as AWS KMS
      participant DB as Application data store
      CI->>CI: Build image, generate SBOM and provenance
      CI->>Registry: Push immutable image digest
      CI->>Signer: Sign digest and attestations with approved CI identity
      Signer->>Registry: Publish signature and attestation material
      Admission->>Registry: Fetch verification material for deployment digest
      Admission->>Admission: Verify issuer, signer identity, digest and policy predicates
      alt Verification failed
        Admission-->>CI: Reject deployment
      else Verification passed
        Admission-->>CI: Admit deployment request
      end
      Note over Admission,App: Runtime controllers start only admitted workloads
      App->>KMS: GenerateDataKey with authorized key and encryption context
      KMS-->>App: Plaintext data key and wrapped data key
      App->>App: Encrypt payload locally, discard plaintext key when no longer needed
      App->>DB: Store ciphertext, nonce, authentication tag and wrapped data key`
  ],
  'ethical-hacker-easy-way.md': [
    `flowchart LR
      scope[Define owned environment and workload contract] --> inventory[Inventory identities, images, mounts and network paths]
      inventory --> fixtures[Create baseline and prohibited configuration fixtures]
      fixtures --> review[Run local policy regressions without executing workloads]
      review --> evidence[Record expected and observed failure reasons]
      evidence --> admission[Extend to disposable cluster admission tests]
      admission --> runtime[Verify allowed and denied runtime behavior]`,
    `flowchart TB
      developer[Developer changes workload configuration] --> fixture[Local Pod configuration fixture]
      fixture --> checks[Selected privilege, mount, identity and image checks]
      checks -->|Prohibited fields| reject[Reject fixture; no workload starts]
      checks -->|Selected checks pass| candidate[Candidate for environment verification]
      runtime@{ icon: "logos:container-docker", label: "Actual runtime remains a separate test", h: 64 }
      candidate -.-> runtime
      note[Local checks do not implement full Kubernetes admission] -.-> checks`,
    `sequenceDiagram
      autonumber
      actor Tester as Lab author
      participant Fixture as In-memory Pod specification
      participant Policy as Local selected-field checker
      Tester->>Fixture: Add privileged flag, host PID and hostPath
      Fixture->>Policy: Review main and init container configuration
      Policy-->>Tester: Report privilege, host namespace and mount violations
      Tester->>Fixture: Restore baseline and add unsafe init container
      Fixture->>Policy: Review all configured container types
      Policy-->>Tester: Reject init-container bypass
      Note over Tester,Policy: Fixtures are never submitted to a runtime`,
    `sequenceDiagram
      participant Tester as Authorized cluster owner
      participant API as Kubernetes API and admission
      participant CNI as Supporting network implementation
      participant Pod as Disposable workload
      Tester->>API: Submit configured admission test in owned namespace
      API-->>Tester: Reject prohibited Pod or admit approved Pod
      Tester->>CNI: Configure and verify supported network policy
      Tester->>Pod: Test allowed destination and denied destination
      Pod-->>Tester: Record actual reachability and identity evidence
      Note over Tester,Pod: Production extension, not executed by local fixture
      Tester->>API: Remove owned test workloads and namespace`
  ],
  'threat-modeling.md': [
    `flowchart LR
      scope[Define system, assets and assumptions] --> boundaries[Map data flows and trust boundaries]
      boundaries --> threats[Identify credible threats and abuse cases]
      threats --> controls[Assign mitigations, owners and verification tests]
      controls --> evidence[Validate residual risk with evidence]
      evidence -->|Architecture or assumptions change| scope`,
    `flowchart TB
      client[External user or partner] -->|HTTPS and bearer token| ingress[Ingress with WAF rules]
      ingress --> api[Account API]
      api -->|Verify issuer, audience, expiry and scopes| auth[Identity provider keys and authorization policy]
      api -->|Authorized transaction only| db[Transaction database]
      api -->|Minimized advisory context| ai[AI advisory service]
      ai -->|Untrusted advisory output| validation[Schema and business-rule validation]
      validation --> api
      kms@{ icon: "logos:aws-security-kms", label: "Key and secret services", h: 64 }
      api -->|Scoped credential or cryptographic operation| kms
      audit@{ icon: "logos:aws-logging-cloudtrail", label: "Configured application and platform audit sinks", h: 64 }
      api -.-> audit
      note[WAF filtering does not replace token or transaction authorization] -.-> api`,
    `sequenceDiagram
      autonumber
      actor Client as External client
      participant Ingress as TLS ingress and WAF
      participant API as Account API
      participant Keys as Cached issuer JWKS
      participant Policy as Authorization policy
      participant AI as Advisory AI service
      participant DB as Transaction database
      Client->>Ingress: HTTPS transfer request with bearer token and idempotency key
      Ingress->>API: Forward request after configured perimeter checks
      API->>Keys: Obtain signing keys, refresh on unknown key ID
      API->>API: Validate signature, issuer, audience and expiry
      API->>Policy: Check user scope and account ownership
      alt Invalid token or unauthorized account
        API-->>Client: Reject, no ledger mutation
      else Authorized request
        opt Advisory fraud analysis enabled
          API->>AI: Send minimized context
          AI-->>API: Advisory result
          API->>API: Validate result against schema and business rules
        end
        API->>DB: Execute authorized idempotent transaction over protected connection
        DB-->>API: Commit result
        API-->>Client: Return application result
      end`,
    `flowchart TD
      subgraph external["External trust boundary"]
        client[Banking client]
      end
      subgraph perimeter["Perimeter boundary"]
        ingress[TLS termination and configured WAF rules]
      end
      subgraph services["Application identity boundary"]
        api[Account API and transaction authorization]
        ai[Advisory AI service]
      end
      subgraph data["Data access boundary"]
        db[Transaction database]
        keys[Key and secret service]
      end
      client -->|HTTPS| ingress
      ingress -->|Configured authenticated backend connection| api
      api -->|Minimized input over authenticated channel| ai
      ai -->|Untrusted result; validate before use| api
      api -->|Scoped database identity and TLS| db
      api -->|Authorized key or secret operation| keys`
  ]
};
