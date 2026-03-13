# Hop Atlas

Hop Atlas is a T3 app for beer lovers. The first cut includes:

- A brewery discovery map with location-aware cards
- Concise beer review surfaces
- A route planner with city and vibe filters
- A journal section for editorial content and SEO depth

## Stack

- Next.js App Router
- TypeScript
- tRPC
- Prisma
- NextAuth
- Tailwind CSS v4
- Postgres for production-ready persistence
- pnpm, Husky, lint-staged, Commitlint, and CI guardrails

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment file and adjust values as needed:

```bash
cp .env.example .env
```

3. Start the local Postgres container when you want real data persistence:

```bash
pnpm dev:db
```

4. Apply the schema and seed the catalog:

```bash
pnpm db:push
pnpm db:seed
```

5. Start the app:

```bash
pnpm dev
```

The UI is resilient if Postgres is not up yet. It falls back to curated catalog content so product work can move immediately.

## Scripts

- `pnpm dev` runs Next.js in turbo mode
- `pnpm dev:db` starts the local Postgres container
- `pnpm db:push` syncs the Prisma schema to the database
- `pnpm db:seed` loads the sample beer catalog
- `pnpm lint` runs ESLint
- `pnpm typecheck` runs TypeScript checks
- `pnpm format:write` formats the repo with Prettier
- `pnpm check` runs the core quality gate used for CI

## Product Direction

- Member accounts can unlock saved routes, personal tasting logs, and review history
- The brewery catalog is ready to move from curated seed data to real records in Postgres
- The journal can later shift from static content to MDX or a CMS without changing the surface area

## Git Process

- Pre-commit runs lint-staged
- Pre-push runs typecheck
- Commit messages are validated with Conventional Commits
- CI runs install, lint, typecheck, Prisma generate, and build
