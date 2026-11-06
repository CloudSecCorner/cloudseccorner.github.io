# RAG and Agent Memory: Keep Data Permissions Through the Whole Pipeline

Reviewed: 2026-11-06

## Include the data lifecycle in the security review

OWASP's [GenAI Data Security Best Practices v2, Part 1](https://genai.owasp.org/resource/genai-data-security-best-practices-v2-part1/), published November 3, 2026, describes a program-level approach to GenAI data security. The practical design below is an original example: preserve ownership and authorization as source content moves into retrieval, model context, caches, and memory.

Start with a data-flow inventory. For each source, record its owner, tenant, readers, classification, retention policy, deletion path, and allowed downstream use. Include transformed copies such as chunks, embeddings, summaries, logs, and cached answers rather than tracking only the original file.

## Authorize before content reaches the model

Retrieval should establish the caller's permitted corpus and document access before returning text into model context. Filtering an answer after generation cannot undo disclosure to an unauthorized model request, intermediate tool, or log sink.

Do not let a retrieved document set its own tenant or permission context. Treat instructions found in source text as untrusted data. Connect the application review to the [OWASP agentic-security resource](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) and keep action authorization separate from the model's interpretation of content.

## Test copies and caches explicitly

| Boundary | Negative test |
| --- | --- |
| Document to retrieval | Tenant A cannot retrieve tenant B's document |
| Document ACL to caller | Another user in the same tenant cannot read an unauthorized document |
| Response cache to caller | A shared query cannot reuse another caller's private result |
| Permission change to cache | A policy change invalidates or bypasses stale authorized results |
| Source deletion to derived copies | Removed content stops appearing through documented retrieval paths |

An identity-aware cache key is only part of a design. Explain expiry, invalidation, policy revisions, revocation, and what happens when a source cannot be revalidated. Tenant-level keys may still be too broad when permissions differ within a tenant.

## Keep evidence useful and proportionate

Log document references, policy decisions, data classifications, and correlation IDs where practical. Decide separately when sensitive content is necessary for an investigation and how it is protected. Keep secrets and raw bearer tokens out of routine prompts and telemetry.

Use the [OWASP threat-modeling method](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) to assign each boundary an owner and an executable verification step. Treat backup retention and external model-provider retention as explicit dependencies with their own evidence.

The [threat-regression lab](/labs/Threat-Modeling) provides synthetic retrieval, cache-key, and deletion tests. It does not implement a vector database or prove deletion from a real storage system. Port its failure cases to your actual retrieval engine, cache, memory store, and tenant lifecycle before marking those controls complete.
