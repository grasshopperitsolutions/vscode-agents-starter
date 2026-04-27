# VS Code Agents Starter

A **brain-only** workspace template for React + TypeScript + Vercel + Firebase projects.

Fork this into any new repo and your AI agents are immediately ready to use. The template contains no app code — just the rules and agent instructions that tell VS Code's Copilot Chat how to work in your projects.

---

## What's inside

```
vscode-agents-starter/
├── AGENTS.md                        ← always-on workspace rules for every agent
└── .github/
    ├── copilot-instructions.md      ← VS Code Copilot coding conventions
    └── agents/
        ├── starter.agent.md         ← scaffolds new apps and features
        ├── test-runner.agent.md     ← creates, runs, and fixes tests
        ├── translations.agent.md   ← maintains locale files and UI copy
        ├── seo.agent.md             ← creates and verifies metadata and SEO
        └── reviewer.agent.md        ← reviews code quality, security, and rules
```

---

## How to use

### 1. Fork or use as a template

Click **Use this template** on GitHub to create a new repo with these files pre-loaded.
Or fork it and rename it for your project.

### 2. Open in VS Code

VS Code automatically detects `AGENTS.md` and `.github/copilot-instructions.md` and applies them to every Copilot Chat session in the workspace.

### 3. Pick an agent and start building

Open VS Code Chat (`⌘I` / `Ctrl+I`), click the agent picker dropdown, and choose an agent.

Example prompts:

```
@Starter create a tic-tac-toe game with Google login and Firebase
@Starter scaffold a new React + TypeScript project with my standard proxy folder
@Test Runner create and run tests for the auth module
@Translations find all hardcoded strings and move them to locale files
@SEO update the metadata and Open Graph tags for all routes
@Reviewer review the last set of changes before I open a PR
```

---

## Agents

| Agent | What it does | Hands off to |
|---|---|---|
| **Starter** | Scaffolds new apps, features, and the `proxy` folder structure | Test Runner, Reviewer |
| **Test Runner** | Creates tests, runs lint/typecheck, fixes failures | Reviewer |
| **Translations** | Detects missing keys, updates locale files, cleans up copy | SEO |
| **SEO** | Creates and verifies metadata, OG tags, structured data, canonicals | Translations, Test Runner |
| **Reviewer** | Reviews for correctness, security, naming, and rule compliance | — |

Agents hand off to each other automatically where configured — no manual switching needed.

---

## What the Starter agent scaffolds

Every time you ask the Starter agent to create a new project or feature, it will generate a `proxy` folder in your project with the following structure:

```
proxy/
├── vercel.json
├── _middleware.ts          ← CORS, security headers, request tracing
├── .env.example            ← all required env vars documented
├── package.json
├── tsconfig.json
├── lib/
│   ├── firebaseAdmin.ts    ← single Firebase Admin bootstrap (auth, db, storage)
│   ├── cors.ts
│   ├── responses.ts        ← typed { success, message, data?, error? } helpers
│   └── env.ts
└── api/
    ├── auth/index.ts       ← verify token, getUser, revokeToken
    ├── db/index.ts         ← get, list, create, update, remove (Firestore)
    ├── storage/index.ts    ← signedUrl, delete, list (Cloud Storage)
    └── ai/index.ts         ← placeholder: "AI not configured" until you wire a provider
```

The AI route (`api/ai`) is always scaffolded but starts disabled, returning:
```json
{ "success": false, "message": "AI not configured" }
```
When you're ready, open `proxy/api/ai/index.ts` and follow the TODO comments to plug in OpenAI, Anthropic, Gemini, or Perplexity.

---

## Running agents in parallel

VS Code agents run one at a time in a single chat window. For true parallel execution after a scaffold:

- **Multiple VS Code windows** — open the project in 2–3 windows and run different agents simultaneously
- **GitHub Actions** — add a workflow that runs tests, translation checks, and SEO audits in parallel on every push (ask the Starter agent to generate one)
- **Copilot cloud agent** — assign separate GitHub Issues to the cloud agent for background parallel work (requires Copilot Pro+)

---

## AGENTS.md

The `AGENTS.md` file is the single source of truth for all agents. It enforces:

- React + TypeScript as the default stack
- Latest stable packages only — no deprecated dependencies
- Mandatory `proxy` folder on every new scaffold
- Firebase Admin SDK on server only — never in client bundles
- AI routes start as provider-agnostic placeholders
- Structured JSON responses: `{ success, message, data?, error? }`
- Lint, typecheck, and tests run after every meaningful change

Edit `AGENTS.md` to adjust these rules for your project at any time.
