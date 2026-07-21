# Quiz Arcade

A small quiz SPA (Vite + React + Tailwind, routed with React Router).
On load it fetches 50 questions from the [Open Trivia DB](https://opentdb.com/)
and builds 10 quizzes of 5 questions each.

- **Home** — browse quizzes or hit "I'm lucky" for a random one.
- **Play** — answer one question at a time; pick an answer to reveal if it was
  right, then continue. Cancel any time.
- **Finish** — score, correct answers, time and a few extra stats.

## Getting started

```bash
npm install    # install dependencies
cp .env.example .env.local   # add your Gemini API key for the AI quiz page
npm run dev    # start the dev server (http://localhost:5173)
```

`VITE_GEMINI_API_KEY` powers the AI quiz page. The rest of the app works
without it.

## Scripts

```bash
npm run build     # production build
npm run preview   # preview the production build
npm test          # run unit tests once
npm run test:watch
npm run lint      # oxlint
```
