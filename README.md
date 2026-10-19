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
- Concerts, photos, videos, releases and contact messages are managed by Matthias at `/admin`.
  His guide (German) is [docs/ANLEITUNG.md](docs/ANLEITUNG.md).

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
4. Create a Blob store in the Vercel project (Storage → Blob); this sets `BLOB_READ_WRITE_TOKEN`.
5. Set `DATABASE_URL`, `ADMIN_PASSWORD_HASH` and `IP_HASH_SALT` in the project's environment
   variables, and for the contact form `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
   (verify the sending domain in Resend), `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
   See `.env.example`; each integration is optional and the site degrades gracefully without it.
6. Replace `SITE_URL` and `CONTACT_EMAIL` in `src/lib/site.ts`, and add the postal address on the
   legal notice page.

Vercel's free Hobby plan is for non-commercial use only; a musician's site taking bookings needs
the Pro plan, or Netlify (only the adapter changes).

## Security

- CSP is configured in `svelte.config.js` (`kit.csp`): nonces on rendered pages, hashes in a
  `<meta>` tag on prerendered ones. The inline theme script in `src/app.html` is allowed by a hash
  computed from the file at build time. New third-party embeds need their host added there.
- `hooks.server.ts` adds the remaining security headers to rendered responses and guards `/admin`.
- Uploads are re-encoded in the browser and checked by magic bytes on the server; visitor text is
  never rendered as HTML.

## Structure

- `src/routes`: public pages; `admin/` is the German-language admin area
- `src/lib/components`: site shell and UI components; `ui/` holds the design-system pieces
- `src/lib/styles/tokens.css`: colours, type scale, spacing, motion
- `src/lib/server`: database, auth, rate limiting, event queries (server-only)
- `src/lib/events`: event form validation, slugs, time zones, formatting, iCalendar export
- `src/lib/music`: YouTube/embed URL parsing and the release form
- `src/lib/contact`: contact form schema
- `docs/ANLEITUNG.md`: admin guide for Matthias (German)
- `drizzle/`: SQL migrations
- `e2e/`: Playwright tests
