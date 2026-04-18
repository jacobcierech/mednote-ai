# MedNote AI — Full App

A full-stack Next.js app for AI-powered clinical note generation.

---

## What's included

- `/login` and `/register` — account creation and sign in
- `/dashboard` — stats, recent notes, breakdown
- `/generate` — structured input fields + AI note generation
- `/history` — filterable list, version history, edit/delete
- `/settings` — profile, preferences, password, audit log

### Database tables
- `users` — accounts with hashed passwords
- `notes` — every generated note saved per user
- `note_versions` — full history of every regeneration
- `audit_logs` — every login, create, edit, delete action

---

## Setup (step by step, no coding needed)

### Step 1 — Open your terminal and go to this folder

```bash
cd ~/Desktop/mednote-folder   # or wherever you put this
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs Next.js, SQLite, OpenAI, and everything else. Takes ~1-2 minutes.

### Step 3 — Create your environment file

In your mednote folder, create a new file called `.env.local` (note the dot at the start).

Paste this into it:

```
OPENAI_API_KEY=sk-...your key here...
JWT_SECRET=pick-any-long-random-string-of-characters-here
DATABASE_PATH=./mednote.db
```

- `OPENAI_API_KEY` → your existing OpenAI key (same one you were using before)
- `JWT_SECRET` → type any random string of 30+ characters (e.g. `mednote-super-secret-key-2026-xyz`)
- `DATABASE_PATH` → leave as is — SQLite file is created automatically

### Step 4 — Start the app

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### Step 5 — Create your account

Go to http://localhost:3000/register and create your account.
That's it — the database is created automatically on first run.

---

## How it works

1. You fill in the structured fields (diagnosis, deficits, interventions, etc.)
2. The frontend sends them to `/api/notes` (POST)
3. The backend generates the note via OpenAI GPT-4o
4. The note is saved to SQLite with a version record
5. Every action is logged in `audit_logs`
6. You can open any note in History, view old versions, and click "Edit & regenerate" to create a new version

---

## Building for production (when you're ready to go live)

```bash
npm run build
npm start
```

Then deploy to [Railway](https://railway.app) or [Render](https://render.com) — both are free to start.

---

## Project structure

```
mednote/
├── app/
│   ├── (auth)/
│   │   ├── login/page.js
│   │   └── register/page.js
│   ├── (app)/
│   │   ├── layout.js        ← sidebar + auth guard
│   │   ├── dashboard/page.js
│   │   ├── generate/page.js
│   │   ├── history/page.js
│   │   └── settings/page.js
│   └── api/
│       ├── auth/
│       │   ├── login/route.js
│       │   ├── register/route.js
│       │   ├── logout/route.js
│       │   ├── me/route.js
│       │   └── settings/route.js
│       ├── notes/
│       │   ├── route.js        ← list + create
│       │   └── [id]/route.js   ← get + update + delete
│       └── audit/route.js
├── lib/
│   ├── db.js       ← SQLite setup + all tables
│   ├── auth.js     ← JWT helpers
│   ├── audit.js    ← audit log writer
│   └── openai.js   ← note generation
├── .env.local      ← YOUR KEYS (never commit this)
└── package.json
```
