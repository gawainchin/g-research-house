# G-Morning-Brief

Static web version of Gawain's morning market briefing.

## Deploy to Vercel

```bash
npm i -g vercel
vercel login   # opens browser — authenticate with GitHub
cd ~/projects/g-morning-brief
vercel deploy   # first deploy (creates the project)
vercel --prod   # subsequent production deploys
```

## How it works

1. The brief is generated daily by a cron job (8am HK Mon–Fri)
2. The latest brief is written to `public/brief.txt` and `public/brief.json`
3. The Next.js app reads `/brief.json` client-side and renders it
4. A lightweight shared-password gate protects `/` and the raw brief assets via middleware

## Lightweight auth gate

Set these environment variables locally or in Vercel:

```bash
BRIEF_GATE_PASSWORD=your-shared-password
BRIEF_GATE_COOKIE_SECRET=a-long-random-secret
```

Protected routes:
- `/`
- `/brief.json`
- `/brief.txt`
- `/brief.html`

Users sign in at `/login`. Successful login sets an HTTP-only cookie. `/logout` clears it.

## Updating the brief

After the cron runs, copy the latest brief text and render it:

```bash
python3 scripts/generate_brief_html.py \
  --input /path/to/brief.txt \
  --output public/brief.html

# Then commit and push to trigger Vercel redeploy:
git add public/brief.html && git commit -m "Update brief" && git push
```

## Local development

```bash
npm install
npm run dev
```
