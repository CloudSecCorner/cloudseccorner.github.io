# MCP Security After the July 2026 Protocol Revision

Reviewed: 2026-11-06

## Treat a protocol upgrade as an integration change

The [MCP 2026-07-28 release](https://blog.modelcontextprotocol.io/posts/2026-07-28/) introduces a stateless core, revised request handling, and authorization changes. Older session-oriented examples need a deliberate migration review. Pin the protocol revision and compatible SDKs on both sides rather than combining snippets from different specification versions.

Write down the actual transport, discovery behavior, request metadata, and extension support for every client/server pair. A successful connection test does not establish that authentication, scope challenges, and denied operations behave correctly.

## Keep protocol metadata separate from authority

New routing metadata is useful to gateways. It does not establish the caller's identity or prove that the operation is permitted. Compare declared method/tool metadata with the parsed request, validate the schema, and apply resource-specific policy before dispatch.

The [versioned authorization specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) requires audience validation for protected MCP resources and describes scope handling. Model output, a request header, and an access token are different inputs; give each an explicit validation path.

## Build a migration acceptance matrix

| Test | Expected behavior |
| --- | --- |
| Supported client calls an allowed tool | Successful authorized response |
| Valid token intended for another resource | Authentication/authorization rejection |
| Authenticated caller lacks required scope | A documented insufficient-scope response |
| Declared tool differs from parsed arguments | Reject before dispatch |
| Approval reused for changed arguments | Reject before side effect |
| Legacy client reaches an unsupported revision | Explicit compatibility failure, not silent fallback |

Add deployment-specific cases for retries, cancellation, metadata caching, discovery URL validation, and outbound network restrictions. Do not invent a universal HTTP status code for every application-policy denial; distinguish protocol errors from your tool's domain errors.

## Test downstream identity explicitly

The [MCP security guide](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) rejects token passthrough and discusses confused-deputy and SSRF risks. Use separate downstream credentials or an explicit supported delegation flow with its own audience and scope. Keep credentials out of model context and tool result text.

For an original implementation exercise, use the [agent-boundary lab](/labs/Agentic-Cloud-Security). Its approval and replay cases are local application-policy examples, not a complete MCP conformance suite. Follow with [workload identity](/labs/Zero-Trust-Architecture) to test an actual authenticated connection.

Keep the release checklist small: supported revisions, negative authorization cases, egress policy, audit correlation, rollback conditions, and an owner for each result. Rerun it when any of the client, server, gateway, or identity-provider configurations changes.
