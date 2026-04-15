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
2. The brief text is wrapped into `public/brief.html` using `scripts/generate_brief_html.py`
3. The Next.js page reads `/brief.html` client-side and renders it

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
