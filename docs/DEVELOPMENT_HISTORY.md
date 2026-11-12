# DelphiaFit Website — Creation and Development History (May 2025–November 2026)

**Maintainer:** Matt Delphia  
**Document date:** 2026-11-12  
**Scope:** Approximately eighteen months, May 2025–November 2026, documenting the origins and evolution of the DelphiaFit website and its supporting backend. May 2025 is the beginning of the requested retrospective window, not a verified first-code date. 
**Evidence status:** Retrospective with repository-backed milestones; not a certification of production deployment.

## 1. The problem, personal experience and founding idea

DelphiaFit began as a response to a problem the founder experienced directly. Fitness software was crowded yet fragmented: maintaining one training journey often required several apps and websites for workouts, meals, protein, hydration, goals and progress. Paying for multiple services was not always affordable, and moving data between services or recording it manually created friction.

While training alongside professional MMA fighters and working toward personal fitness goals, the founder routinely carried a notebook to log workouts. That practical annoyance, combined with the cost of multiple tracking applications, became the problem worth solving. While laid up with an injury, the concept came together: build a fitness website and app that unified the functions people needed across their training journey.

The project also provided a hands-on way to learn software development. What began as a coding exercise grew into a passion project informed by personal training experiences and the wider fitness community. The guiding design objective was neither another single-purpose tracker nor a collection of unrelated pages. It was an integrated platform where fitness information could be accessed together and ultimately across different devices.

The product promise is summarized by the founder's chosen slogan: **“Every Goal on One Platform.”**

The origin described here is the founder's account. No precise conception date should be inferred from that account alone; **May 2025** represents the requested start of the historical review window, and the first verifiable repository commit is in June 2025.

### Founding requirements derived from the problem

1. Bring training, food, hydration, performance, and goal tracking into one experience.
2. Replace loose notes and duplicated manual entry with saved, reusable records.
3. Minimize dependence on disconnected products and unnecessary subscriptions.
4. Support both independent training and working with coaches and other athletes.
5. Make the platform practical on the devices people use in and away from the gym.
6. Expand only when an additional capability helps users pursue goals without unnecessary fragmentation.

## 2. Prototype: Python and Kivy (2025)

The earliest repository identified is [gym-App](https://github.com/mdelphia85/gym-App), with an initial GitHub commit dated **2025-06-08** ([commit](https://github.com/mdelphia85/gym-App/commit/e4519e251)). Its files include `main.py`, `main.kv`, and `tracker_logic.py`. The material captures a Python/Kivy graphical application with home and workout screens and workout-logging intent. The repository's October 2025 README also describes a broader planned gym-management scope: tracking water, protein, calories, meals, scheduling, apparel, and subscriptions.

**Important qualification:** the checked-in `main.py` also contains interactive Python session transcripts and duplicate content. It provides evidence of the exploration and design, **not** proof that all README features ran as a completed application. The prototype should be described as an early-stage experiment, not the production DelphiaFit codebase.

## 3. Transition to full-stack web architecture (2026)

The production-oriented project was separated into:
- [delphiafit-web](https://github.com/mdelphia85/delphiafit-web): React frontend, React Router, Vite, JavaScript/CSS, Vitest and Testing Library; `src/App.jsx` defines application routes and menus.
- [delphiafit-backend](https://github.com/mdelphia85/delphiafit-backend): Python/FastAPI application, SQLAlchemy data models, REST routers, authentication and API services. Database connection and migration modules support persistent application data. The web app uses `VITE_API_URL` to select its API endpoint.

The GitHub repositories evidence code structure, not a guarantee that current production exactly matches their default branches. In particular, backend work also exists on `repaired-backend`, and frontend/backend staging and feature branches exist.

### Architecture and principal domains

**User-facing domain:** registration, login and recovery; profile, settings; calories, protein, water, meals, supplements, nutrition, workouts, free training, progress, goals, journal, history, recovery, analytics, challenges, achievements and streaks.

**Coaching:** coach login/session, dashboards, trainer/client relationships, invitations, plan building, communications, team operations and drill libraries. Coach roles must not inherit owner/admin access.

**Community and specialty:** social feed, groups, leaderboards, sports academies, events, marketplace listings, DelphiaFit Kids, and firefighter, EMS, police, military and other tactical training screens. Existence of a page or database model is not proof of complete integration.

**Administration:** separate admin login, dashboard, analytics, users, announcements, messages and audit logs. Current implementation must be validated for authorization and real data.

### Core system design and data flow

The application is structured around client presentation, authenticated HTTP service calls, backend domain logic and shared relational persistence:

```text
React 19 + Router 7 + Vite 8 website (this repository)
          |
          | HTTPS / JSON / bearer authentication
          v
Python FastAPI backend (separate repository)
    |-- auth and role checks
    |-- fitness, nutrition and coaching routers
    |-- social, sports, specialist and admin routers
    |-- conversational AI and domain services
          |
          v
SQLAlchemy models / relational database
    |-- accounts and user profiles
    |-- workout, nutrition and progress records
    |-- coaching, community and AI history
```

**Frontend boundary.** `src/App.jsx` composes routes and navigation. `src/pages/` contains member, coaching, training and specialty pages; `src/Admin/` has administration interfaces; `src/components/` contains reusable controls. `src/utils/api.js` centralizes authenticated JSON requests, error handling and optional timeouts, while `src/utils/userDataApi.js` wraps record CRUD routes. `src/config/api.js` reads the server URL from `VITE_API_URL`.

**Backend boundary.** The FastAPI project organizes routes under `app/routers/`, data schemas, models, services, and database sessions/migrations. The backend is the appropriate place to enforce permissions and user-data ownership. Its `main` and `repaired-backend` branches are different implementation snapshots; neither alone proves the deployed configuration.

**Persistence boundary.** SQLAlchemy uses a server-side `DATABASE_URL`. Member records are designed to persist under authenticated ownership, rather than live only in a browser's local component state or demonstration data. Database migrations and production schema validation are separate operational tasks.

**Role boundaries.** The website supports member, coach and administrative sessions. Navigation can expose appropriate destinations, but server authorization—not a hidden button—must prevent unauthorized access to personal records or private administration.

**Testing boundary.** Frontend component tests with mocked HTTP calls validate screen logic but do not prove production API compatibility. Database tests, authentication tests, deployed browser checks, and real user journeys must be combined before assigning a production-complete status.

### Feature expansion and page families

The November 12, 2026 `src/App.jsx` route inventory contains **107 explicit route declarations**. This represents paths, including demos, aliases and redirects—not 107 separately certified production features.

| Family | Routes | Engineering purpose |
| --- | ---: | --- |
| Public, onboarding and demonstration | 19 | Entry, login, registration, legal pages and example flows |
| Core member fitness, nutrition and performance | 19 | Workout, consumption, progress, goals, AI and recovery |
| Coach, trainer and team workflows | 16 | Client relationships, invitations, plans, messaging and rosters |
| Community, sports and expanded product features | 20 | Groups, challenges, recruiting, sports, marketplace and related modules |
| Tactical and occupational training | 24 | Public safety, military, preparation and specialist workflows |
| Owner administration | 9 | Private system management, analytics, users and audit interfaces |

For the route-by-route list with exact paths and components, consult the [website README](../README.md#complete-website-page-and-route-inventory-source-snapshot-november-12-2026).

### Technical choices and their consequences

- **React and Vite** enabled a modular, browser-based interface and fast development feedback, but required careful routing and state management as the number of screens grew.
- **FastAPI** organized Python backend functionality into explicit interfaces; the separation helps future non-browser clients reuse the same business rules.
- **Relational persistence** enables saved workout and nutrition history but adds schema, migration, authorization and environment-management responsibilities.
- **Dedicated roles** support coaches, clients and administrators but require end-to-end permission testing at the API layer.
- **Feature breadth** increases user value only when its workflows are connected to real data and tested; a growing page count alone is not a measure of completion.

## 4. Nutrition planning and the AI Coach

Nutrition Pro uses stored preferences, profile-derived targets and saved generated meal plans. The web client calls `/nutrition-coach/settings`, `/nutrition-coach/targets`, `/nutrition-coach/meal-plans` and `/nutrition-coach/meal-plans/generate`. The distinction between generated personalized plans and static sample plans is important.

The user reports DelphiaFit's AI Coach was activated on the website by **2026-11-02**. The checked-in `src/pages/AICoach.jsx` submits questions to `POST /ai/coach`, loads `/ai/records`, displays prior replies, and provides fatigue/sleep inputs, progress and error states. The backend `repaired-backend` AI router includes user authentication, record persistence, idempotency handling and adaptive inputs from existing workout records. This evidences a conversational question-and-answer interface. It does **not** establish that the AI autonomously updates training plans, that camera motion analysis is operational, or that every deployed environment has a hosted model configured.

## 5. Testing, debugging and operational controls

The repositories include unit/component tests and backend tests; the frontend has `npm run test`, `npm run lint` and `npm run build`. The file [PROGRESS_REPORT.md](../PROGRESS_REPORT.md) records an earlier production-upgrade test campaign and its limitations. Its historical result (**162 backend and 78 frontend tests passed**) should be read as a snapshot, not a current CI report. The same report explicitly states that browser, PostgreSQL, deployment and coach-hub verification had not been completed **at that time**. Subsequent commits may have changed status; any remaining issue requires rechecking.

Recent repository commits on **2026-11-11** document admin live-data refresh and avoiding fabricated zero metrics. Treat those as implementation evidence, not an end-to-end production audit. Test categories include authentication, authorization, records ownership, API contract, migrations, navigation, form validation and accessibility. Production sign-off requires deployed browser/mobile smoke tests and backend/database confirmation.

## 6. Website deployment and production operations

The website repository contains `vercel.json` and Vercel Analytics dependencies, while the backend has `Dockerfile` and `railway.toml`. These identify web and service deployment tooling, but the exact deployed branch, environment settings, production database and all live behavior must be verified independently. The owner reports that the website and its conversational AI features were live by early November 2026.

This document is exclusively a history of the **website and the server services that enable it**. Android implementation, mobile release planning and cross-platform parity are tracked separately and are intentionally not stored as a checklist in this repository.

## 7. Evolution toward Android and iOS

The unifying architecture is intended to serve more than the browser. The existing Android Studio application is the next client to align with the website. Rather than reproduce server-side rules in Kotlin or create disconnected member accounts, the Android client should authenticate to the appropriate backend, submit and retrieve the same authorized workout/nutrition/coaching data, and handle mobile-specific networking, permissions, credential storage and lifecycle requirements. The founder has reported that an Android app exists and has run in an emulator; feature parity and release readiness remain separate verification tasks.

An iOS application is planned after Android. It should build on the same backend service contracts and authoritative records, while adopting an Apple-appropriate UI, permissions, accessibility, secure storage and distribution workflow. **No iOS application or App Store release is claimed as completed.**

This section captures how the web architecture influences subsequent clients. Android-specific implementation tasks and its detailed parity checklist are deliberately **not committed to the website repository**.

## 8. Long-term engineering direction

The vision is to help one person manage a connected fitness journey, from everyday activity and nutrition to individual coaching, sports training and, where validated, team and occupational fitness. A possible progression is:

1. **Reliable web foundation:** ensure account, nutrition, fitness, trainer and admin workflows are backed by real records and verified in deployed environments.
2. **Android continuity:** bring the current native application into alignment with the web/backend so saved information carries across devices.
3. **iOS continuity:** create an Apple client reusing the same accounts and service data, rather than a separate product silo.
4. **Deeper individual coaching:** expand goal history, plan adherence, coach/client relationships, training insights and evidence-aware AI assistance.
5. **Sports and community:** strengthen team training, competition, community, recruiting and MMA/other sports workflows, subject to product validation.
6. **Specialized fitness:** develop occupation-specific training and readiness support, with clear boundaries around professional accreditation and medical claims.
7. **Optional integrations:** consider wearables, approved fitness services and other integrations only when they reduce user friction while respecting privacy and consent.

These are **future product directions**, not statements of implemented features or dated release commitments. The underlying engineering strategy is modular services, stable API contracts, one authoritative account/data model, explicit roles, tests and documentation.

## 9. Evidence and chronology

| Evidence | Date | What it establishes |
|---|---|---|
| [gym-App initial commit](https://github.com/mdelphia85/gym-App/commit/e4519e251) | 2025-06-08 | Initial Python/Kivy-era repository |
| [gym-App README commit](https://github.com/mdelphia85/gym-App/commit/01962dbf0) | 2025-10-19 | Written early gym-management scope |
| [Frontend source tree](../src/App.jsx) | Inspected 2026-11-12 | Web feature and route inventory |
| [Backend main](https://github.com/mdelphia85/delphiafit-backend/blob/main/app/main.py) | Inspected 2026-11-12 | Early/alternate backend service composition |
| [Backend repaired branch AI router](https://github.com/mdelphia85/delphiafit-backend/blob/repaired-backend/app/routers/ai.py) | Inspected 2026-11-12 | More recent AI contract and persistence implementation |
| [Production progress report](../PROGRESS_REPORT.md) | Repository snapshot | Historical test and gap report |
| [Recent web commit](https://github.com/mdelphia85/delphiafit-web/commit/83c7934c3e3344c2f7cfd878315777aa00bb12bc) | 2026-11-11 | Latest inspected web default-branch head before documentation |

## 10. Development log and ongoing maintenance

For subsequent changes, record: date, requirement/problem, affected website/backend module, commit and branch, API/schema migration, automated test result, manual deployed verification, owner approval, website release version and rollback plan. Record failed experiments and refactors as well as successes, preserving the distinction between the first prototype, branch-local implementations and verified deployed behavior.

**Not yet independently verified:** concept and development milestones before the first GitHub evidence in June 2025, original idea/date beyond Git history, deployed website/API branch and commit, actual production database and secrets configuration, payment integration, push delivery, hardware integrations, camera tracking and all specialty workflows. Do not turn these into completed milestones without evidence.
