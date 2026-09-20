# 🤖 AI Agent Navigator (AGENTS.md)

Welcome, AI Agent. Before you write any code in this repository, you **MUST** consult the documents routed below. This project is a strict school examination deliverable (UKK Smart Space Booking) and is evaluated against rigid rules.

## Where to Get Knowledge

Read in this order. Lower rows represent ground truth when docs and code disagree:

| Priority | Source | Purpose |
|---|---|---|
| 1 | **[PRD.md](./PRD.md)** | Canonical product source, features, sitemap, and explicit lifecycles (Bagian II). Canonical for *what* we build and *what we do NOT build*. |
| 2 | **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Technical structure, Laravel request lifecycle, storage paths, and architectural decisions. |
| 3 | **[SCHEMA.md](./SCHEMA.md)** | ERD and Database Migration constraints. **Strictly mapping to API DTOs.** |
| 4 | **[API_CONTRACT.md](./API_CONTRACT.md)** | The exact 45 in-scope REST API endpoints. You MUST NOT add, rename, or modify endpoints outside this contract. |
| 5 | **[RULE.md](./RULE.md)** | Hard constraints and Anti-Bias rules (e.g., no scope creep, strict envelope). |
| 6 | **[SKILL.md](./SKILL.md)** | Guidelines on how you (the agent) should act, read, and write in this repository. |
| 7 | **Actual Code** | The single source of truth. Docs drift — **always verify against code** before asserting anything. |
