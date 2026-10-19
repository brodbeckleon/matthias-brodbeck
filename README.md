# Matthias Brodbeck – website

Portfolio site for the Zurich drummer and percussionist Matthias Brodbeck: SvelteKit 2, Svelte 5,
paraglide i18n (English, Swiss German, Japanese), Drizzle + Postgres, deployed to Vercel.

## Development

```sh
npm install
cp .env.example .env   # then fill in ADMIN_PASSWORD_HASH and IP_HASH_SALT (see below)
npm run dev
```

Without `DATABASE_URL`, the app uses an embedded Postgres (PGlite) stored in `.data/pglite` and
applies the migrations itself. Nothing else needs to be installed.

| Command                      | What it does                                           |
| ---------------------------- | ------------------------------------------------------ |
| `npm run check`              | Type-check Svelte and TypeScript                       |
| `npm run lint`               | Prettier and ESLint                                    |
| `npm run test:unit`          | Vitest                                                 |
| `npm run test:e2e`           | Playwright against a fresh build, including axe checks |
| `npm run admin:hash -- 'pw'` | Print a value for `ADMIN_PASSWORD_HASH`                |
| `npm run db:generate`        | Create a migration after changing `schema.ts`          |
| `npm run db:migrate`         | Apply migrations to `DATABASE_URL` (Neon)              |

Install the Playwright browser once with `npx playwright install chromium`.

## Content

- Page text lives in `messages/{en,de-ch,ja}.json`. A unit test fails if a locale is missing a key.
- Site-wide facts (domain, contact email, social links) live in `src/lib/site.ts`. The domain and
  email are still placeholders and must be replaced before launch.
- Concerts are managed by Matthias at `/admin`.

## Admin password

There is a single admin login. To set or change the password:

1. `npm run admin:hash -- 'a long password'` (at least 12 characters).
2. Put the printed value into `ADMIN_PASSWORD_HASH` (in `.env` locally, in the Vercel project
   settings in production) and redeploy.

Changing the password does not log out existing sessions; delete the rows in the `session` table
for that.

## Deployment (Vercel + Neon)

1. Create a Neon project in `eu-central-1` (Frankfurt) and copy its connection string.
2. Run `DATABASE_URL=… npm run db:migrate` once, and again after every new migration.
3. Import the repository in Vercel. The adapter deploys functions to `fra1`.
4. Set `DATABASE_URL`, `ADMIN_PASSWORD_HASH` and `IP_HASH_SALT` in the project's environment
   variables.
5. Replace `SITE_URL` and `CONTACT_EMAIL` in `src/lib/site.ts`.

Vercel's free Hobby plan is for non-commercial use only; a musician's site taking bookings needs
the Pro plan, or Netlify (only the adapter changes).

## Structure

- `src/routes`: public pages; `admin/` is the German-language admin area
- `src/lib/components`: site shell and UI components; `ui/` holds the design-system pieces
- `src/lib/styles/tokens.css`: colours, type scale, spacing, motion
- `src/lib/server`: database, auth, rate limiting, event queries (server-only)
- `src/lib/events`: event form validation, slugs, time zones, formatting, iCalendar export
- `drizzle/`: SQL migrations
- `e2e/`: Playwright tests
