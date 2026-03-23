# GitHub Interaction Policy

All GitHub operations (creating/updating pull requests, issues, comments, branches, etc.) **MUST** target the fork `PhillyUrbs/PowerAppsCodeApps` (the `origin` remote) and **NEVER** the upstream `microsoft/PowerAppsCodeApps` repository.

- When creating pull requests, open them against `PhillyUrbs/PowerAppsCodeApps`, not `microsoft/PowerAppsCodeApps`.
- When pushing branches, push to `origin` (`PhillyUrbs/PowerAppsCodeApps`).
- When creating or commenting on issues, use the `PhillyUrbs/PowerAppsCodeApps` fork.
- Never create, modify, or interact with issues, PRs, or branches on the `microsoft/PowerAppsCodeApps` upstream repository.

# Knowledge Management — Cross-Device Persistence

This repo is developed from multiple machines. Copilot's local memory (`/memories/repo/`) does **not** sync across devices. To ensure findings, learnings, and architectural decisions are available everywhere, follow these rules:

## Commit knowledge to the repo, not just memory

When significant learnings, architectural decisions, or troubleshooting insights emerge during a session, **commit them to the appropriate file in the repo** rather than relying solely on Copilot repo memory. Committed files travel with `git pull` to every dev machine.

### Where to put what

| Type of knowledge | Committed location |
|---|---|
| Deployment/CI-CD learnings | `.github/DEPLOYMENT.md` |
| Per-sample architecture/patterns | `<sample-folder>/README.md` or `<sample-folder>/ARCHITECTURE.md` |
| Copilot behavior & repo conventions | `.github/copilot-instructions.md` (this file) |
| Sub-project Copilot context | `<project-folder>/.github/copilot-instructions.md` |
| Agent/skill definitions | `plugin/power-apps-plugin/` |

### Repo memory is supplementary only

Copilot repo memory files are useful as working scratchpads during a session, but anything worth keeping long-term must be committed. After committing knowledge, the corresponding repo memory entry can be removed to avoid stale duplicates.

## Never store environment-specific data

Committed knowledge files must **never** contain any of the following:

- **App IDs** (`appId`, component GUIDs)
- **Environment IDs** (`environmentId`, environment GUIDs)
- **Tenant IDs** or directory IDs
- **Client secrets**, tokens, or credentials
- **User-specific URLs** (e.g., URLs containing specific environment or tenant slugs)
- **Connection reference IDs** or connector instance IDs
- **Organization-specific domain names** (e.g., `contoso.onmicrosoft.com` is acceptable as a placeholder only)

These values belong in:
- `power.config.json` (already gitignored)
- GitHub Actions secrets
- Local environment variables
- `.env` files (which should also be gitignored)

When documenting patterns that involve these values, use placeholders like `<your-app-id>`, `<environment-id>`, etc.
