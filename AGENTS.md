# Workspace agent rules

## Core stack
- Default to React + TypeScript for web apps unless the user explicitly requests another stack.
- Prefer modern, stable package versions.
- Avoid deprecated packages.
- Do not use forced dependency upgrade shortcuts that may destabilize the project.
- Ask before introducing major architectural changes.

## Project structure
- Every new app or feature scaffold must preserve a `proxy` folder at the repository root.
- The `proxy` folder is mandatory unless the user explicitly opts out.
- The `proxy` folder must contain Vercel configuration and API route scaffolding needed for server-side integrations.
- The minimum required `proxy` structure is:

```
proxy/
├─ vercel.json
├─ _middleware.ts
└─ api/
   ├─ auth/
   │  └─ index.ts
   ├─ db/
   │  └─ index.ts
   ├─ storage/
   │  └─ index.ts
   └─ ai/
      └─ index.ts
```

## Proxy requirements
- `proxy/api/auth` must be prepared for Firebase Admin authentication workflows.
- `proxy/api/db` must be prepared for Firebase Admin database access.
- `proxy/api/storage` must be prepared for Firebase Admin storage access.
- `proxy/api/ai` must always exist, but must start in a disabled placeholder state.
- The default AI placeholder response must clearly state that AI is not configured yet.
- `proxy/_middleware.ts` must be created and wired for CORS, security headers, request tracing, and route guards where applicable.
- Keep proxy code modular and reusable. Shared helpers live in `proxy/lib`.

## Firebase Admin requirements
- Use Firebase Admin SDK on server-side routes only.
- Never expose admin credentials to the client.
- Read Firebase Admin credentials from environment variables.
- Normalize multiline private keys correctly (replace `\\n` with `\n`).
- Initialize Firebase Admin exactly once using a shared bootstrap.
- Support auth, database, and storage from the shared admin bootstrap.
- Prefer returning structured JSON: `{ success, message, data?, error? }`.

## AI route requirements
- The initial AI route must not assume any provider.
- It must return a safe placeholder:
  - `success: false`
  - `message: "AI not configured"`
- Add clear TODO markers for provider-specific wiring.
- Keep the AI route provider-agnostic so it can later support OpenAI, Anthropic, Gemini, Perplexity, or another API.

## Vercel and API conventions
- Keep Vercel configuration inside `proxy`.
- API routes must be grouped by concern: auth, db, storage, ai.
- Add OPTIONS handling for CORS where cross-origin use is expected.
- Use explicit method guards and clear HTTP status codes.
- Prefer small focused endpoints over one large catch-all file.

## Code quality
- After generating or editing code, run lint, typecheck, and tests when available.
- When adding features, update tests or create them if missing.
- Keep naming consistent with the current repository conventions.
- Document environment variables when adding new server functionality.

## Output expectations
- When scaffolding a project, create the proxy folder and stub routes by default.
- When unsure, choose the smallest clean implementation that is production-friendly.
