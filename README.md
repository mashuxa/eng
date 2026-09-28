# eng

Personal workplace-English learning app (B1 → B2). Next.js app, deployed on Vercel.

- `app/` — pages: Home (activity heatmap), Topics (103 speaking topics), Plan (46 lessons)
- `data/lessons.json` — the 46-day curriculum (mirrors the Notion "Plan" database)
- `lib/progress-context.tsx` — progress state: localStorage + Supabase sync (auto, no manual export/import)

## Dev

```
npm install
npm run dev
```

## Deploy

Zero-config on Vercel — import this repo, framework preset "Next.js", no env vars required.
