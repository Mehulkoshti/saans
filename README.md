# Saans — Your Air Quality Companion

**Saans** (सांस, "breath") is a GenAI-powered assistant that helps families and
communities navigate severe winter smog and urban air pollution. Enter your
city and a few details about your household, and get a personalized daily
routine: when it's safe to go outside, how to clean your indoor air, and which
low-emission lifestyle swaps cut both your personal exposure and your carbon
footprint — with the direct impact of each choice quantified.

Built for **PromptWars Virtual — Main Challenge 06: Urban Air Quality
Assistant**.

## How it works

1. **Live air quality, no API key required.** Saans geocodes the city you
   enter and fetches a live US AQI reading plus a 24-hour pollutant forecast
   from [Open-Meteo](https://open-meteo.com/), a free, keyless public API.
2. **A deterministic rule engine always runs.** Household risk levels, the
   day's cleanest hours to be outdoors, a prioritized routine, indoor air
   hacks, and sustainable commute swaps (with quantified CO2 and exposure
   impact) are computed from the AQI data and your inputs — this works
   100% of the time, with or without the AI layer below.
3. **A GenAI layer adds a human narrative.** The computed facts are passed to
   **Google Gemini** (primary), which writes a short, warm explanation tying
   the plan together in plain language. If Gemini is unset or its call fails,
   the app automatically retries with **DeepSeek**; if both fail, it
   **falls back to the deterministic plan automatically** — the feature is
   resilient by design, not accidentally missing.

This two-layer design (deterministic core + optional AI narrative) is
intentional: the app is always fully functional, and the `aiEnhanced` flag in
the API response tells you honestly whether the AI layer actually ran.

## Tech stack

- **Next.js 16** (App Router, Route Handlers, TypeScript, Tailwind CSS v4)
- **Open-Meteo** Geocoding + Air Quality APIs (no key, no rate-limit signup)
- **Google Gemini** (primary) + **DeepSeek** (fallback) for the narrative layer
- **Zod** for request validation, an in-memory rate limiter, and strict
  security headers (CSP, X-Frame-Options, etc.) on every response
- **Vitest** + Testing Library for unit tests
- **Recharts** for the pollutant breakdown chart, **Lucide** for icons

## Getting started

```bash
npm install
cp .env.example .env.local   # add your GEMINI_API_KEY and/or DEEPSEEK_API_KEY (optional)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The assistant itself
lives at `/app`.

### Environment variables

| Variable           | Required | Purpose                                             |
| ------------------- | -------- | ---------------------------------------------------- |
| `GEMINI_API_KEY`   | No       | Primary AI narrative provider (Google AI Studio). App works fully without it. |
| `GEMINI_MODEL`     | No       | Overrides the Gemini model (default `gemini-3.8-flash`). |
| `DEEPSEEK_API_KEY`  | No       | Fallback AI narrative provider, used if Gemini is unset or fails. |
| `DEEPSEEK_MODEL`    | No       | Overrides the DeepSeek model (default `deepseek-chat`). |

## Scripts

| Command               | Purpose                          |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the dev server              |
| `npm run build`        | Production build                  |
| `npm run lint`         | ESLint                            |
| `npm run typecheck`    | TypeScript, no emit               |
| `npm run test`         | Vitest in watch mode              |
| `npm run test:run`     | Vitest, single run (used in CI)   |
| `npm run test:coverage`| Vitest with coverage report       |

## Project structure

```
app/
  page.tsx            Marketing landing page
  app/page.tsx         The assistant (wizard + results)
  api/plan/route.ts    POST endpoint: geocode -> AQI -> plan -> AI narrative
lib/
  aqi.ts               Open-Meteo client + US AQI categorization
  planner.ts           Deterministic rule engine (risk, routines, swaps, impact)
  ai.ts                Gemini -> DeepSeek narrative generation (graceful fallback)
  validation.ts        Zod schema for the API request body
  rateLimit.ts         In-memory per-IP rate limiter
components/            UI: wizard steps, AQI gauge, charts, results view
__tests__/             Vitest unit tests for lib/ and validation
```

## Security & reliability notes

- No secrets are ever sent to the client; `DEEPSEEK_API_KEY` is read only in
  a `server-only`-guarded module.
- All user input is validated with Zod (bounds-checked, regex-constrained
  city names) before use.
- The `/api/plan` route is rate-limited per client IP.
- Security headers (CSP, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) are applied globally in `next.config.ts`.
- Every external call (Open-Meteo, DeepSeek) has a request timeout and fails
  closed to a clear error or a deterministic fallback — never a hang.

## Assumptions made

- **Vertical chosen:** Main Challenge 06 — Urban Air Quality Assistant.
- Air quality is assumed well-approximated by the nearest geocoded city
  centroid (Open-Meteo's grid resolution); street-level hyperlocal variation
  (e.g. next to a highway vs. a park) is out of scope.
- "Household" is modeled as counts of adults/children/elderly plus two binary
  flags (respiratory condition, pregnancy) — enough to drive distinct risk
  tiers without collecting identifying health data.
- The "exposure index" and CO2-saved figures are illustrative, relative
  estimates derived from AQI tier and reported outdoor hours/commute mode
  (using standard per-km emission factors), not medical or regulatory
  measurements.
- Users are assumed to have JavaScript enabled and a modern evergreen
  browser; no server-rendered-only fallback is provided.
- The AI narrative is treated as enhancement, never a dependency — every
  recommendation a user sees is generated by the deterministic engine first,
  so the app is fully usable even with no AI key configured at all.

## Accessibility

Semantic landmarks, a skip-to-content link, labelled form fields with
described hints/errors, visible focus states, `aria-live` status updates
during loading/errors, and charts/gauges exposed with descriptive
`aria-label`s/`role="img"` so screen-reader users get the same information as
the visual chart. Respects `prefers-reduced-motion`.
