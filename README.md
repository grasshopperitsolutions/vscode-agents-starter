# VS Code Agents Starter

A ready-to-use workspace starter for React + TypeScript + Vercel + Firebase Admin projects, with:

- `AGENTS.md` — always-on workspace rules for every agent
- `.github/copilot-instructions.md` — VS Code Copilot coding conventions
- 5 custom VS Code agents in `.github/agents/`
- A fully scaffolded `proxy/` folder with Vercel serverless routes

---

## Project structure

```
├─ AGENTS.md                          ← always-on workspace agent rules
├─ .github/
│  ├─ copilot-instructions.md         ← VS Code Copilot coding conventions
│  └─ agents/
│     ├─ starter.agent.md
│     ├─ test-runner.agent.md
│     ├─ translations.agent.md
│     ├─ seo.agent.md
│     └─ reviewer.agent.md
└─ proxy/                             ← Vercel serverless API proxy
   ├─ vercel.json
   ├─ _middleware.ts
   ├─ package.json
   ├─ tsconfig.json
   ├─ .env.example
   ├─ lib/
   │  ├─ firebaseAdmin.ts              ← single Firebase Admin bootstrap
   │  ├─ cors.ts
   │  ├─ responses.ts
   │  └─ env.ts
   └─ api/
      ├─ auth/index.ts                 ← verify, getUser, revokeToken
      ├─ db/index.ts                   ← get, list, create, update, remove
      ├─ storage/index.ts              ← signedUrl, delete, list
      └─ ai/index.ts                   ← placeholder ("AI not configured")
```

---

## Quick start

### 1. Clone and configure the proxy

```bash
cd proxy
npm install
cp .env.example .env.local
# Fill in your Firebase Admin credentials in .env.local
```

### 2. Run the proxy locally

```bash
cd proxy
npm run dev
# Starts Vercel dev server on http://localhost:3000
```

### 3. Configure your AI provider (when ready)

Open `proxy/api/ai/index.ts` and replace the placeholder block with your chosen provider.
Provider setup instructions are in the file comments (OpenAI, Anthropic, Gemini, Perplexity).

---

## VS Code agents

Open VS Code Chat (`⌘I` / `Ctrl+I`), click the agent picker, and you will see:

| Agent | Purpose |
|---|---|
| **Starter** | Scaffold apps and features following repo conventions |
| **Test Runner** | Create, run, and fix tests |
| **Translations** | Maintain locale files and UI copy |
| **SEO** | Create and verify metadata and structured data |
| **Reviewer** | Review code for quality, security, and rule compliance |

Agents hand off to each other automatically where configured.

---

## Environment variables

All required and optional env vars are documented in `proxy/.env.example`.

For Vercel deployment, add them in:
**Vercel Dashboard → Project → Settings → Environment Variables**

---

## Firebase Admin credentials

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **Generate new private key**
3. Copy values from the JSON file into your `.env.local`
4. Make sure `FIREBASE_PRIVATE_KEY` has actual newlines (or `\\n` escaped — the lib normalizes both)

---

## Proxy API routes

### Auth — `POST/GET /api/auth?action=...`

| Action | Method | Body / Query |
|---|---|---|
| `verify` | POST | `{ idToken }` |
| `getUser` | GET | `?uid=...` |
| `revokeToken` | POST | `{ uid }` |

### Database — `*/api/db?action=...`

| Action | Method | Body / Query |
|---|---|---|
| `get` | GET | `?collection=...&id=...` |
| `list` | GET | `?collection=...&limit=...` |
| `create` | POST | `{ collection, data }` |
| `update` | PUT | `{ collection, id, data }` |
| `remove` | DELETE | `?collection=...&id=...` |

### Storage — `*/api/storage?action=...`

| Action | Method | Body / Query |
|---|---|---|
| `signedUrl` | POST | `{ filePath, action: "read"|"write", expiresIn? }` |
| `delete` | DELETE | `?filePath=...` |
| `list` | GET | `?prefix=...` |

### AI — `POST /api/ai`

Returns `{ success: false, message: "AI not configured" }` until you wire up a provider in `proxy/api/ai/index.ts`.
