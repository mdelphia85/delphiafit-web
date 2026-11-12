# DelphiaFit Website — Creation and Development History (May 2025–November 2026)

**Maintainer:** Matt Delphia  
**Document date:** 2026-11-12  
**Scope:** Approximately eighteen months, May 2025–November 2026, documenting the origins and evolution of the DelphiaFit website and its supporting backend. May 2025 is the beginning of the requested retrospective window, not a verified first-code date. 
**Evidence status:** Retrospective with repository-backed milestones; not a certification of production deployment.

## 1. Origin and design problem

DelphiaFit originated from practical experience in fitness and personal training. The central product problem was fragmented tracking: a member could need separate services for workouts, nutrition, hydration, goals, trainer communication, and performance. DelphiaFit was conceived as a unified platform under the tagline **“Every Goal on One Platform.”** The original concept expanded over time into general fitness, coaching, sports, community, and specialized training.

## 2. Prototype: Python and Kivy (2025)

The earliest repository identified is [gym-App](https://github.com/mdelphia85/gym-App), with an initial GitHub commit dated **2025-06-08** ([commit](https://github.com/mdelphia85/gym-App/commit/e4519e251)). Its files include `main.py`, `main.kv`, and `tracker_logic.py`. The material captures a Python/Kivy graphical application with home and workout screens and workout-logging intent. The repository's October 2025 README also describes a broader planned gym-management scope: tracking water, protein, calories, meals, scheduling, apparel, and subscriptions.

**Important qualification:** the checked-in `main.py` also contains interactive Python session transcripts and duplicate content. It provides evidence of the exploration and design, **not** proof that all README features ran as a completed application. The prototype should be described as an early-stage experiment, not the production DelphiaFit codebase.

## 3. Transition to web and services (2026)

The production-oriented project was separated into:
- [delphiafit-web](https://github.com/mdelphia85/delphiafit-web): React frontend, React Router, Vite, JavaScript/CSS, Vitest and Testing Library; `src/App.jsx` defines application routes and menus.
- [delphiafit-backend](https://github.com/mdelphia85/delphiafit-backend): Python/FastAPI application, SQLAlchemy data models, REST routers, authentication and API services. Database connection and migration modules support persistent application data. The web app uses `VITE_API_URL` to select its API endpoint.

The GitHub repositories evidence code structure, not a guarantee that current production exactly matches their default branches. In particular, backend work also exists on `repaired-backend`, and frontend/backend staging and feature branches exist.

### Architecture and principal domains

**User-facing domain:** registration, login and recovery; profile, settings; calories, protein, water, meals, supplements, nutrition, workouts, free training, progress, goals, journal, history, recovery, analytics, challenges, achievements and streaks.

**Coaching:** coach login/session, dashboards, trainer/client relationships, invitations, plan building, communications, team operations and drill libraries. Coach roles must not inherit owner/admin access.

**Community and specialty:** social feed, groups, leaderboards, sports academies, events, marketplace listings, DelphiaFit Kids, and firefighter, EMS, police, military and other tactical training screens. Existence of a page or database model is not proof of complete integration.

**Administration:** separate admin login, dashboard, analytics, users, announcements, messages and audit logs. Current implementation must be validated for authorization and real data.

## 4. Nutrition planning and the AI Coach

Nutrition Pro uses stored preferences, profile-derived targets and saved generated meal plans. The web client calls `/nutrition-coach/settings`, `/nutrition-coach/targets`, `/nutrition-coach/meal-plans` and `/nutrition-coach/meal-plans/generate`. The distinction between generated personalized plans and static sample plans is important.

The user reports DelphiaFit's AI Coach was activated on the website by **2026-11-02**. The checked-in `src/pages/AICoach.jsx` submits questions to `POST /ai/coach`, loads `/ai/records`, displays prior replies, and provides fatigue/sleep inputs, progress and error states. The backend `repaired-backend` AI router includes user authentication, record persistence, idempotency handling and adaptive inputs from existing workout records. This evidences a conversational question-and-answer interface. It does **not** establish that the AI autonomously updates training plans, that camera motion analysis is operational, or that every deployed environment has a hosted model configured.

## 5. Testing, debugging and operational controls

The repositories include unit/component tests and backend tests; the frontend has `npm run test`, `npm run lint` and `npm run build`. The file [PROGRESS_REPORT.md](../PROGRESS_REPORT.md) records an earlier production-upgrade test campaign and its limitations. Its historical result (**162 backend and 78 frontend tests passed**) should be read as a snapshot, not a current CI report. The same report explicitly states that browser, PostgreSQL, deployment and coach-hub verification had not been completed **at that time**. Subsequent commits may have changed status; any remaining issue requires rechecking.

Recent repository commits on **2026-11-11** document admin live-data refresh and avoiding fabricated zero metrics. Treat those as implementation evidence, not an end-to-end production audit. Test categories include authentication, authorization, records ownership, API contract, migrations, navigation, form validation and accessibility. Production sign-off requires deployed browser/mobile smoke tests and backend/database confirmation.

## 6. Website deployment and production operations

The website repository contains `vercel.json` and Vercel Analytics dependencies, while the backend has `Dockerfile` and `railway.toml`. These identify web and service deployment tooling, but the exact deployed branch, environment settings, production database and all live behavior must be verified independently. The owner reports that the website and its conversational AI features were live by early November 2026.

This document is exclusively a history of the **website and the server services that enable it**. Android implementation, mobile release planning and cross-platform parity are tracked separately and are intentionally not stored as a checklist in this repository.

## 7. Evidence and chronology

| Evidence | Date | What it establishes |
|---|---|---|
| [gym-App initial commit](https://github.com/mdelphia85/gym-App/commit/e4519e251) | 2025-06-08 | Initial Python/Kivy-era repository |
| [gym-App README commit](https://github.com/mdelphia85/gym-App/commit/01962dbf0) | 2025-10-19 | Written early gym-management scope |
| [Frontend source tree](../src/App.jsx) | Inspected 2026-11-12 | Web feature and route inventory |
| [Backend main](https://github.com/mdelphia85/delphiafit-backend/blob/main/app/main.py) | Inspected 2026-11-12 | Early/alternate backend service composition |
| [Backend repaired branch AI router](https://github.com/mdelphia85/delphiafit-backend/blob/repaired-backend/app/routers/ai.py) | Inspected 2026-11-12 | More recent AI contract and persistence implementation |
| [Production progress report](../PROGRESS_REPORT.md) | Repository snapshot | Historical test and gap report |
| [Recent web commit](https://github.com/mdelphia85/delphiafit-web/commit/83c7934c3e3344c2f7cfd878315777aa00bb12bc) | 2026-11-11 | Latest inspected web default-branch head before documentation |

## 8. Development log and ongoing maintenance

For subsequent changes, record: date, requirement/problem, affected website/backend module, commit and branch, API/schema migration, automated test result, manual deployed verification, owner approval, website release version and rollback plan.

**Not yet independently verified:** concept and development milestones before the first GitHub evidence in June 2025, original idea/date beyond Git history, deployed website/API branch and commit, actual production database and secrets configuration, payment integration, push delivery, hardware integrations, camera tracking and all specialty workflows. Do not turn these into completed milestones without evidence.
