# Agentic Cloud Security Essentials

AI agents change cloud security because they do more than generate text. They can select tools, use credentials, read data, call APIs, and change infrastructure. This lab helps you threat-model an agentic cloud workload and design controls that keep its actions bounded, observable, and recoverable.

## Learning objectives

By the end of this lab, you will be able to:

- map the identities, tools, data, and trust boundaries in an agentic system;
- identify indirect prompt injection, tool misuse, memory poisoning, and excessive agency;
- design least-privilege authorization and approval gates for cloud actions;
- define telemetry for detecting and investigating unsafe behavior; and
- build a security test plan for an agent before production deployment.

## Reference scenario

You are reviewing a cloud operations agent that helps engineers investigate incidents. The agent can read monitoring alerts, query logs, inspect Kubernetes workloads, update incident tickets, and restart a workload after a human approves the action.

The agent uses a hosted language model, a retrieval store containing runbooks, and tools exposed through an internal gateway.

```text
Engineer
   |
   v
Agent application -----> Hosted model
   |                         |
   |                         v
   +----> Runbook retrieval store
   |
   +----> Tool gateway ----> Monitoring API
                      |----> Object storage
                      |----> Kubernetes API
                      +----> Incident platform

Security services: identity provider, policy engine, secrets manager,
approval service, audit pipeline, detection and response platform
```

## Exercise 1: inventory the blast radius

Create an inventory for every action the agent can take.

- **Read alert:** workload identity; alert metadata; no side effect; no approval.
- **Query logs:** scoped workload identity; operational logs; possible sensitive-data exposure; no approval.
- **Inspect workload:** read-only cluster role; runtime metadata; no side effect; no approval.
- **Update ticket:** service identity; incident records; changes the system of record; no approval.
- **Restart workload:** short-lived delegated identity; production workload; possible service disruption; approval required.

For each action, ask:

- Could the agent complete it with fewer permissions?
- Can its credential be issued just in time and expire quickly?
- Is access restricted to the current tenant, project, cluster, and incident?
- Can untrusted content influence the action or its arguments?
- Is there enough evidence to reconstruct why the action happened?

## Exercise 2: trace trust boundaries

Mark every place where data or authority crosses a boundary, including:

- user input entering the agent;
- runbooks or logs entering model context;
- model output becoming a tool request;
- the tool gateway exchanging credentials for cloud access;
- a human approval authorizing one specific action; and
- tool results returning to memory or conversation history.

Treat retrieved text, webpages, tickets, logs, and tool descriptions as untrusted input. They may contain instructions that attempt to redirect the agent.

## Exercise 3: identify agentic threats

### Intent and instruction

- **Direct prompt injection:** Can a user override the agent's purpose or safety rules?
- **Indirect prompt injection:** Can a malicious runbook, log entry, ticket, or webpage influence the agent?
- **Goal manipulation:** Can an attacker change the objective during a multi-step task?
- **Memory poisoning:** Can malicious state persist and affect future actions?

### Identity and authorization

- **Excessive agency:** Can the agent act beyond the minimum needed for the task?
- **Privilege escalation:** Can tool arguments, role chaining, or delegated access expand its authority?
- **Cross-tenant access:** Can identifiers be changed to reach another account or customer?
- **Approval reuse:** Can an approval authorize a different action or be replayed later?

### Tools and execution

- **Tool poisoning:** Can a tool description or response manipulate later decisions?
- **Argument injection:** Can untrusted input become a command, query, path, URL, or API parameter?
- **Unsafe composition:** Can several safe tools combine into a high-impact workflow?
- **Unbounded execution:** Can loops, retries, or delegation consume excessive resources?

## Exercise 4: design the control plane

Build controls around the agent instead of relying on the model to enforce policy.

### Identity and authorization

- Use a dedicated workload identity for the agent runtime.
- Issue short-lived credentials for tools and cloud APIs.
- Bind delegated access to the user, incident, target resource, and expiration time.
- Separate read, write, and destructive capabilities into different roles.

### Policy and approval

- Validate every tool call with a deterministic policy engine.
- Allow-list tools, actions, resources, regions, and argument patterns.
- Require approval for production changes, destructive actions, permission changes, and data export.
- Show the exact action, target, impact, and evidence to the approver.
- Make approvals single-use and bind them to the proposed action.

### Isolation

- Run code and command tools in an ephemeral sandbox without ambient credentials.
- Restrict network egress and block cloud metadata endpoints by default.
- Keep secrets out of model context and inject them only into the required tool.
- Cap execution time, token use, tool calls, retries, and delegated sub-agents.

### Observability

Record a linked trace with the user and workload identities, agent and policy versions, retrieved source identifiers, proposed and executed tool calls, approvals, cloud API results, resource changes, and rollback status. Redact secrets and unnecessary sensitive content.

## Exercise 5: run adversarial tests

1. Put a hidden instruction in a test runbook asking the agent to read an unrelated secret.
2. Add a log entry containing a shell command and verify it remains data.
3. Ask the agent to restart a workload outside the approved namespace.
4. Approve one restart, then modify the workload name before execution.
5. Replay an approved action after its expiration time.
6. Trigger a tool loop and confirm that execution limits stop it.
7. Make the model unavailable and verify the system fails safely.
8. Reconstruct each test from the audit trail without using the conversation UI.

For each test, record the expected control, observed behavior, evidence, and remediation owner.

## Production readiness checklist

- ☐ Every agent and tool has a named owner.
- ☐ The agent's purpose and prohibited actions are documented.
- ☐ Tool access uses short-lived, least-privilege identity.
- ☐ High-impact actions require scoped, single-use approval.
- ☐ Tool calls are validated independently of the model.
- ☐ Untrusted content is labeled and separated from control instructions.
- ☐ Code execution and browsing run in restricted sandboxes.
- ☐ Secrets are kept out of prompts, memory, and logs.
- ☐ Resource, cost, retry, and delegation limits are enforced.
- ☐ Agent decisions and cloud actions share a trace identifier.
- ☐ Operators can stop the agent, revoke credentials, and roll back changes.
- ☐ Adversarial tests run before releases and after material changes.

## Further reading

- [OWASP Agentic Security Initiative](https://genai.owasp.org/initiatives/agentic-security-initiative/)
- [OWASP Secure Agent Playbook](https://github.com/OWASP/secure-agent-playbook)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [MITRE ATLAS](https://atlas.mitre.org/)
