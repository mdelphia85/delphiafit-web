# DelphiaFit

**Every Goal on One Platform.**

DelphiaFit is a fitness and coaching platform designed to bring training, nutrition, progress, and community tools into a unified experience. This repository contains the **web frontend**. The Python/FastAPI backend is maintained separately in [delphiafit-backend](https://github.com/mdelphia85/delphiafit-backend).

**Website:** https://delphiafit.com  
**Development history:** [docs/DEVELOPMENT_HISTORY.md](docs/DEVELOPMENT_HISTORY.md) — a retrospective covering May 2025 through November 2026, with verified Git history beginning June 2025.

## Why DelphiaFit was created

The project grew from practical experience in fitness and personal training. The initial idea was to reduce the need for separate tools for workouts, protein/calories, hydration, meals, and training organization. Its earliest tracked prototype used Python and Kivy; the platform later evolved into a browser-based React frontend connected to a FastAPI backend and persistent database.

The June 2025 prototype is preserved in [gym-App](https://github.com/mdelphia85/gym-App). See the development history for evidence and caveats about early prototype completeness.

## Frontend technology

- React 19, React Router 7 and Vite 8
- JavaScript, JSX and CSS
- Vitest and React Testing Library for automated tests
- Vercel configuration and analytics integration
- HTTP API integration through `VITE_API_URL`

Backend concerns, database migrations, authorization and hosted conversational AI belong to the separate backend repository and deployed services.

## Feature areas

The website source includes the following areas. **A routed screen or feature module is not, by itself, evidence of production verification or complete external integrations.**

| Area | Examples |
| --- | --- |
| Core fitness | Workouts, free training, goals, progress, performance and recovery |
| Nutrition | Calories, protein, water, meals, supplements and Nutrition Pro meal planning |
| Coaching | Coach Hub, clients, trainer invitations, assigned plans and messaging |
| AI | Conversational AI Coach, saved coaching history and adaptive input controls |
| Community | Community posts, groups, challenges, achievements, streaks and leaderboards |
| Sports and specialties | Sports academy, competition, public safety and tactical fitness screens |
| Account administration | Authentication, profiles, settings and owner-restricted admin views |

The **AI Coach** is primarily a question-and-answer interface. Its visible web implementation sends questions to `/ai/coach` and can show saved responses. Do not interpret this as a guarantee of autonomous workout adjustment, camera analysis or model availability in every environment.

## Local development

Requirements: Node.js and npm compatible with the project's dependency versions, plus access to a properly configured backend for API-backed functionality.

```bash
git clone https://github.com/mdelphia85/delphiafit-web.git
cd delphiafit-web
npm ci
```

Create a local `.env.local` with your **non-secret frontend** configuration, for example:

```dotenv
VITE_API_URL=https://your-backend-host.example
```

Use your actual approved API base URL. Do **not** place passwords, API secrets, database credentials or private tokens in `VITE_*` variables; Vite embeds those values in frontend builds.

```bash
npm run dev
```

Vite prints the local URL (typically `http://localhost:5173`). Backend-dependent functionality requires a reachable API and valid account permissions.

## Quality checks

```bash
npm run test
npm run lint
npm run build
npm run preview
```

These commands run automated tests, lint checks, production compilation and a local preview. Their presence does not certify the currently deployed application. Validate critical user journeys in a browser against the matching deployed backend and database before release. A historical [progress report](PROGRESS_REPORT.md) documents earlier tests and unresolved verification work; it is not automatically the current production status.

## Source layout

- `src/App.jsx` — routes and menu integration
- `src/pages/` — member, coaching, sports and specialty screens
- `src/Admin/` — restricted administration interfaces
- `src/components/` — shared UI components
- `src/ai/` — frontend AI-related helpers and interface behavior
- `src/utils/` and `src/config/` — API and application utilities
- `src/demo/` — demonstration data, separate from production records
- `docs/DEVELOPMENT_HISTORY.md` — creation process and engineering history

## Security and deployment

Maintain role-based access controls in the backend: hiding a route in the UI is not authorization. Protect user data, test authentication and ownership, configure HTTPS and CORS for the appropriate deployed environments, and validate changes to API payloads and database schemas before rollout.

The repository includes Vercel-related configuration; the backend repository includes container/deployment configuration. Verify deployed branches, environment variables and migrations independently before calling a release production-ready.

## Project scope

This README documents the **DelphiaFit website only** and its relationship to the backend. The existing Android application is maintained separately; its feature migration checklist is intentionally **not stored in this repository**.

## Documentation

- [Development history and creation process](docs/DEVELOPMENT_HISTORY.md)
- [Historical production upgrade progress report](PROGRESS_REPORT.md)
- [Backend repository](https://github.com/mdelphia85/delphiafit-backend)
- [Original Python prototype](https://github.com/mdelphia85/gym-App)
