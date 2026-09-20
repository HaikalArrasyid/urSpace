# Global Skills & Directives (SKILL.md)

As a technical coding agent navigating this repository, adhere strictly to the following navigational habits:

## 1. Context Acquisition
- ALWAYS start your execution loop by briefly querying `docs/AGENTS.md`. It points to the ground truth of the system architecture.
- If directed to change an endpoint payload or write a new Controller/Model file, cross-verify the entity using both `API_CONTRACT.md` and `SCHEMA.md` simultaneously.

## 2. Refactoring Defenses
- When performing wide-scale refactoring via task/grep commands globally, defend the schema fields aggressively against auto-refactoring/translations tools.
  - If autocomplete tools suggest converting `nama_space` to `spaceName`, REJECT the operation. Code MUST abide by `RULE.md` constraint #3.

## 3. Communication Strategy
- When modifying backend configurations or finalizing an API route endpoint, report completion to the end-user by summarizing strictly what was completed according to the API contract index (e.g. `"Completed endpoints 25-31 under /api/admin/members"`). Do not add preamble unless directly requested.
