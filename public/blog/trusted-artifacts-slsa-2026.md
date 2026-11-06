# Trusted Artifacts: SLSA 1.2, Attestations, and Deployment Identity

Reviewed: 2026-11-06

## Separate four decisions

Before deploying an artifact, ask which bytes you are deploying, who produced them, what build process produced them, and whether that result is allowed in this environment. A scanner finding no known vulnerabilities answers none of those questions completely.

[SLSA v1.2](https://slsa.dev/spec/v1.2/) describes supply-chain tracks, levels, and attestation formats. Use its requirements to assess the actual build platform. Adding a signature to a developer laptop build does not automatically provide an isolated trusted builder or a SLSA level.

## Define verification policy before consuming evidence

| Evidence | Consumer decision |
| --- | --- |
| Artifact digest | Exact bytes selected for deployment |
| Signature and certificate | Authenticity under an independently established trust policy |
| Provenance | Expected builder, source, and build parameters |
| SBOM | Dependency inventory for applicability and maintenance review |
| Deployment authorization | Whether this identity may deploy this digest here |

For an image, resolve and pin the verified digest rather than verifying a tag and later deploying whatever that tag points to. Define how unavailable, expired, malformed, or untrusted evidence changes the deployment decision.

## Verify identity as well as cryptography

[Cosign verification](https://docs.sigstore.dev/cosign/verifying/verify/) supports signer-identity and OIDC-issuer constraints. A valid signature from an unexpected signer should fail your release policy. Do not accept a public key merely because it accompanied the download, and do not disable claim checks to suppress a verifier error.

[GitHub artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations) provide signed workflow provenance for consumers to verify. Their security value depends on verification and an appropriate policy for the repository, workflow, and source revision. A compromised approved workflow remains a different problem from an unsigned artifact.

## Constrain the deployment job

[GitHub OIDC](https://docs.github.com/en/actions/concepts/security/openid-connect) lets a trusted workflow obtain short-lived cloud access. Bind cloud trust to the required repository, environment or ref, audience, and approved workflow context. Scope the role to the specific deployment operation. Protect the workflow that is allowed to obtain that role.

Use separate identities for producing an artifact and authorizing production deployment when your release process requires that separation. Keep the approved digest in the promotion record so a rebuild cannot silently substitute a different result.

## Practice the failure cases

The [artifact-integrity lab](/labs/Security-Engineering-Fundamentals) checks real local signatures and rejects changed bytes, altered statements, and signed-but-unapproved builder/source claims. It uses temporary local keys, not Sigstore, and does not claim a SLSA level.

Take those cases into CI, then add your actual attestation verifier, branch protections, cloud trust policy, and deployment gate. Preserve rejected evidence for diagnosis without leaking signing material or cloud tokens.
