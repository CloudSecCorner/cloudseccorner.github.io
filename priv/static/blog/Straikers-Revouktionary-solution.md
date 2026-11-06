# Safeguarding the AI Frontier: Evaluate Agent Runtime Controls with Evidence

Originally published April 23, 2025. Substantially revised and reviewed November 6, 2026.

This guide replaces the original vendor-focused overview with a practical evaluation method. The existing URL remains available. Product claims, supported integrations, and deployment guarantees should be verified against the specific product version under evaluation.

## Start with the action boundary

An agent that can read a ticket, edit a repository, or request a deployment inherits real application permissions. Evaluate the code path between a proposed tool call and its side effect. Identify where the caller is authenticated, where the target is authorized, and which component can reject the call.

The [OWASP Agentic Applications 2026 resource](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) offers an agent-focused risk reference. Use it to structure questions, then require evidence from your own application.

## Ask for a demonstrable failure case

| Evaluation question | Evidence to request |
| --- | --- |
| Can retrieved text grant permissions? | Inject an instruction into a synthetic document and verify that unauthorized tool execution is denied |
| Is approval bound to an action? | Change the target or arguments after approval; execution must fail |
| Can a credential cross service boundaries? | Present a token for another audience; the receiving service must reject it |
| Are tenants isolated? | Attempt a document, cache, and tool access from a different tenant |
| Can an agent run indefinitely? | Demonstrate budget, timeout, cancellation, and retry limits |

These are evaluation scenarios, not reports of an incident or claims about a named vendor. Keep a valid authorized request in every test so a broken integration cannot appear secure simply because it denies everything.

## Measure the whole path

Record request identity, approved scope, policy revision, approval reference, target, decision, and execution result. A gateway's allow decision is different from confirmation that the target completed the action. Correlate them using a stable operation ID and handle retry semantics explicitly.

Review token handling against [MCP security guidance](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices). In particular, a service should not accept an unrelated token and blindly forward it downstream. Require the identity provider and resource owner to define each credential's intended recipient and permitted operation.

Keep sensitive source documents and raw credentials out of routine audit events. For data ownership and lifecycle questions, see [OWASP's GenAI data-security program overview](https://genai.owasp.org/resource/genai-data-security-best-practices-v2-part1/).

## Make the evaluation reproducible

Pin the tested versions, record the deployment mode, and save synthetic inputs, expected decisions, and observed results. Run the same cases when the model, tool definitions, identity configuration, or policy changes. Report false denials and bypasses separately.

Begin with the [agent-boundary lab](/labs/Agentic-Cloud-Security) and [workload-identity lab](/labs/Zero-Trust-Architecture). They provide small executable boundaries. They do not replace a product assessment, a live protocol interoperability test, or a full adversarial evaluation.
