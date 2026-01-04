# IPMAT Institute Probability - Demo Frontend

This is a minimal demo React frontend (Vite) that estimates the probability of getting into sample IIM institutes given an entrance rank and category.


Quick start (macOS / zsh):

```bash
cd /Users/neerajs/Documents/Rank
npm install
npm run dev
```

Tailwind: I added Tailwind configuration. After `npm install` Vite will process Tailwind directives from `src/styles.css` automatically. If you edit `tailwind.config.cjs`, restart the dev server.

Open the shown local URL in your browser. Update `src/data/iims.json` with real cutoffs or your own data to get more realistic results.

Notes:
- This is a demo app. The probability calculation is a simple heuristic and not an official predictor.
