# Che Español

A mobile-friendly web app for learning **Argentine Spanish** (Rioplatense, Buenos Aires style). Type a letter, word, or sentence in Hebrew or English and get:

- The Argentine Spanish form, with voseo and `ustedes` where relevant
- A word-by-word breakdown
- A note wherever Argentine usage differs from Spain Spanish (for example `ll`/`y` pronounced like "sh")
- Read-aloud audio using your device's voice (prefers `es-AR` when available)

Every translation is saved to your cloud history, so you can search it, star it, delete it, and practice it with flashcards or typing drills.

The interface is Hebrew by default, with an English toggle.

## Features

- **Translate**: Hebrew or English in, Argentine Spanish out, with breakdown, note, and audio. Each note can also be translated to Hebrew or English.
- **History**: Every translation grouped by date, with search, favorites, and delete.
- **Practice**: Flashcards (flip) and typing drills, using all entries or only starred ones.
- **Alphabet**: The Spanish alphabet with Argentine pronunciation notes.
- **Grammar**: Lessons on Argentine grammar (voseo, `ustedes`, past tense, diminutives) with examples in Spanish, Hebrew, and English.
- **Grammar tutor**: An AI chat that answers grammar questions about Argentine Spanish.
- **Accounts**: Username and password sign-up, with password reset by email.
- **Daily limit**: Each user gets a fixed number of AI requests per day (default 100).

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) with React 19 and TypeScript
- Tailwind CSS 4
- [Better Auth](https://www.better-auth.com) for username/password auth and password reset
- [Drizzle ORM](https://orm.drizzle.team) with Postgres on [Neon](https://neon.com)
- [Google Gemini](https://ai.google.dev) (default model `gemini-3.5-flash-lite`) for translations, notes, and the grammar tutor
- [Resend](https://resend.com) for password-reset email
- Web Speech API (`speechSynthesis`) for read-aloud audio

## Getting started

### Prerequisites

- Node.js 24 (see `.nvmrc`). Scripts run through `scripts/use-node.sh`, which loads nvm and switches to the version in `.nvmrc`.
- A Neon Postgres database
- A Google AI Studio API key
- A Resend API key (only needed for password-reset emails)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the template and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon connection string (use the pooled host, with `sslmode=require`) |
| `BETTER_AUTH_SECRET` | Random secret, for example from `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Public URL of the app (`http://localhost:3000` locally) |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GEMINI_MODEL` | Gemini model name (default `gemini-3.5-flash-lite`) |
| `DAILY_TRANSLATION_LIMIT` | AI requests per user per day (default `100`) |
| `RESEND_API_KEY` | Resend API key, for password-reset email |
| `EMAIL_FROM` | Sender address, for example `Che Español <onboarding@resend.dev>` |

Never commit `.env.local`. It is already listed in `.gitignore`.

### 3. Create the database tables

```bash
npm run db:migrate
```

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run db:generate` | Generate a migration after changing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to the database |
| `npm run db:push` | Push the schema directly to the database (development only) |

## Project structure

```
src/
  app/
    (auth)/      login, sign-up, forgot and reset password
    (app)/       translate, history, practice, alphabet, grammar
    api/         route handlers: auth, translations, entries, practice, notes, tutor
  components/    shared UI (app shell, entry cards, speech controls, icons)
  db/            Drizzle schema and database client
  lib/
    ai/          Gemini prompts and metered AI calls
    translation/ translation prompt, schema, and Gemini client
    entries/     saved entries repository and DTOs
    grammar/     grammar lessons
    alphabet/    alphabet data
    i18n/        Hebrew and English dictionaries
    speech/      voice selection for read-aloud
drizzle/         generated SQL migrations
scripts/         Node version wrapper and migration runner
```

## Deploying to Vercel

1. Push the repository to GitHub.
2. In [Vercel](https://vercel.com/new), choose **Add New → Project** and import the repository.
3. Add every variable from `.env.example` under **Environment Variables**, using your real values.
4. Set `BETTER_AUTH_URL` to your deployed URL, for example `https://your-app.vercel.app`.
5. Deploy. After that, every push to `main` redeploys automatically.

Make sure `BETTER_AUTH_URL` matches the deployed URL. Otherwise sign-up and login will fail with an invalid origin error.

## Costs

The app is designed to run on free tiers for personal use: Vercel Hobby, Neon Free, Gemini free tier, and Resend Free. Check each provider's current limits before sharing the app widely.

On the Gemini free tier, Google may use the text you send to improve its products. Avoid sending sensitive information through the translator.