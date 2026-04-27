---
applyTo: "**"
---

# Repository coding instructions

- Follow all rules defined in [../../AGENTS.md](../../AGENTS.md).
- Prefer TypeScript for all new code.
- Follow existing project patterns before introducing new abstractions.
- Keep server code separate from client code — never import server-only modules into browser bundles.
- Never place Firebase Admin SDK code in client-side code.
- When creating a new project scaffold, always include the required `proxy` folder structure.
- When creating API stubs, include clear placeholder implementations instead of pretending features are configured.
- For AI features, default to a provider-agnostic placeholder response with `{ success: false, message: "AI not configured" }`.
- For auth, db, and storage routes, centralize Firebase Admin initialization in `proxy/lib/firebaseAdmin.ts`.
- Run lint and typecheck after meaningful changes.
- Add or update tests for behavior changes.
- Document new environment variables in `.env.example`.
