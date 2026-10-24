# Emilio Odongo: portfolio

Full-stack portfolio in four languages (English, Kiswahili, Français, Español).
Astro (static) + Supabase (database, auth, row-level security) + live GitHub and dev.to feeds, hosted on GitHub Pages.

| Feature | How it works |
|---|---|
| Languages | `/en/`, `/sw/`, `/fr/`, `/es/`. Root `/` picks the saved or browser language. SEO `hreflang` tags included. |
| Light / dark | Follows the system, toggle remembers the choice. |
| Projects | Curated list in `src/data/projects.ts`, plus extra projects you add from `/admin/` without redeploying. |
| GitHub | Newest repos and repo count fetched live (cached 30 min). |
| Writing | Latest dev.to articles fetched live. |
| Contact | Saved to Supabase and shown in `/admin/`. Falls back to your email app if no backend is configured. Honeypot + rate limit against spam. |
| Admin | `/admin/`: sign in, read messages, manage projects, see anonymous visit counts. |
| Quality | 26 end-to-end tests, type checks, CI, sitemap, structured data, accessibility basics. |

## 1. Run it
```bash
npm install
cp .env.example .env        # fill in later, the site works without it
npm run dev                 # http://localhost:4321
```

## 2. Make it yours (`src/config.ts`)
Check these before publishing:
- `name`: your live site says **Emilio Odongo**, your accounts say **Ochieng**. Pick one.
- `social.devto`: your dev.to username (the part after `dev.to/`). Currently a guess.
- `social.twitter`: your X username without `@`. Blank hides the link.
- `whatsapp`: international digits, e.g. `254705216347`. `@o.pressure` cannot be used because WhatsApp links need a phone number.

Your existing images: copy `assets/hero.webp` and `assets/about.webp` from your current repo into `public/assets/`. Without them a green "EO" placeholder shows.

## 3. Backend (Supabase), about 10 minutes
1. Create a free project at supabase.com.
2. SQL editor: paste and run `supabase/migrations/0001_portfolio.sql`.
3. Authentication > Sign In / Providers > Email: **turn off "Allow new users to sign up"**, then Users > Add user (your email and a strong password).
4. SQL editor: `insert into admins (user_id) select id from auth.users where email = 'emilioochieng44@gmail.com';`
5. Project Settings > API: copy the Project URL and the **anon public** key into `.env` as `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`. Never use the `service_role` key here.
6. `npm run dev`, then open `/admin/` and sign in.

## 4. Deploy to `https://emilioochieng.github.io`
1. Use a repo named exactly `emilioochieng.github.io` (replace the current files; keep a copy of `assets/`).
2. Repo Settings > Pages > Source: **GitHub Actions**.
3. Repo Settings > Secrets and variables > Actions > **Variables**: add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` (the same public values).
4. Push to `main`. The workflow type-checks, runs the tests, then deploys.

## 5. Add a language
1. Copy `src/i18n/en.ts` to e.g. `de.ts`, translate the values, export it with type `Dict`.
2. Register it in `src/i18n/index.ts` (`LANGS` and `dict`) and in `astro.config.mjs` (sitemap locales).
The compiler lists any missing key. Have a native speaker review the Kiswahili before launch.

## Tests
```bash
npx playwright install chromium   # once
npm test                          # builds with fake public values, mocks every network call
npm run check                     # type check
```

## Privacy and safety notes
- Visits store only the page path and language: no cookies, no IP, no IDs. Do Not Track is honoured. Mention this in a privacy note if you wish.
- Messages contain people's names and emails. Only signed-in admins can read them (row-level security), but delete old ones regularly.
- Supabase free tier pauses inactive projects after a period; open the dashboard now and then.
- Stack, project and article text is rendered as text, never HTML, and only `http(s)` links are accepted.
