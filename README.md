# DelphiaFit

### Every Goal on One Platform.

**One fitness journey. One account. One connected platform.**

[DelphiaFit.com](https://delphiafit.com) · [Development history](docs/DEVELOPMENT_HISTORY.md) · [Backend repository](https://github.com/mdelphia85/delphiafit-backend) · [Original prototype](https://github.com/mdelphia85/gym-App)

---

## The story behind DelphiaFit

DelphiaFit began with a problem I experienced personally. The fitness technology market had become so saturated and fragmented that tracking a complete fitness journey often meant switching between multiple apps and websites. One tool logged workouts, another tracked meals and calories, another handled water intake, and others charged separately for additional features. Bringing all of those tools together was expensive and inconvenient.

I was training alongside professional MMA fighters while working toward my own fitness goals. I understood the value of recording workouts, tracking improvement and staying accountable, but I was tired of carrying a notebook around the gym. I also could not justify paying for multiple fitness subscriptions just to track the different parts of one journey.

While I was laid up with an injury, I started thinking about what a better solution would look like: **why should someone need several disconnected apps just to pursue one set of fitness goals?** I was also learning to code, and that question gave me a practical problem worth solving. What began as a coding and learning project became a passion project rooted in my experience with fitness, training, frustration, and the desire to make useful tools more accessible.

The idea was not to build yet another isolated fitness tracker. It was to **unify pieces of a broken and fragmented fitness app and website experience into one platform**: workouts, nutrition, hydration, progress, training relationships, community and additional training disciplines. That mission is captured in the DelphiaFit slogan:

> **Every Goal on One Platform.**

The ambition is straightforward: users should be able to focus more on training and personal growth, and less on juggling notebooks, accounts, websites, and subscriptions.

*— DelphiaFit founder*

## From learning project to multi-platform software

This project has evolved through several stages, with an approximately 18-month retrospective documented from May 2025 through November 2026. **The first independently verifiable GitHub commit is June 8, 2025**; earlier concept and planning dates are retrospective, not presented as source-control facts.

| Phase | Engineering direction | Status / evidence |
| --- | --- | --- |
| Idea and exploration | Personal training experience, fragmented fitness technology, desire for unified tracking | Founder account |
| Initial prototype (2025) | Python, Kivy interface and workout-tracking experiments | [gym-App](https://github.com/mdelphia85/gym-App), first commit June 8, 2025 |
| Web platform (2026) | React web UI, FastAPI service layer, relational data and feature modules | This repository and [backend](https://github.com/mdelphia85/delphiafit-backend) |
| Conversational AI | AI Coach question-and-answer UI and backend processing | Web `src/pages/AICoach.jsx` and backend AI routes; website reported live by founder |
| Android | Existing native Android Studio app, to be brought into parity with the web platform | In progress; source maintained separately |
| iOS / Apple | Planned Apple-platform client building on the existing backend and shared product model | Future development; not built or released |

The source of the earliest Python prototype includes experimental session output as well as Python/Kivy app code. It is a historical learning artifact, **not** a claim that the entire modern feature set worked in 2025.

---

## The architecture: one platform, multiple clients

The product is designed around a separation between **client interfaces**, **server-side business logic**, and **persistent user data**. As web, Android and eventually iOS clients evolve, they should integrate with the same authorized API and data rather than maintain three unrelated versions of a user's fitness history.

```text
                     DELPHIAFIT PRODUCT
                Every Goal on One Platform

  +----------------------+  +-----------------------+  +----------------------+
  | WEB CLIENT           |  | ANDROID CLIENT        |  | iOS CLIENT           |
  | React / Vite         |  | Android Studio        |  | Planned              |
  | React Router         |  | Native mobile UI      |  | Native Apple UI TBD  |
  | JavaScript / JSX     |  | Existing app; syncing |  | Not implemented yet  |
  +----------+-----------+  +-----------+-----------+  +-----------+----------+
             |                          |                          |
             +--------------------------+--------------------------+
                                        |
                             HTTPS / REST / JSON
                                        |
                        +---------------v----------------+
                        | PYTHON / FASTAPI BACKEND       |
                        | Auth + authorization           |
                        | Validated service endpoints    |
                        | Workout and nutrition records  |
                        | Coach/client and community     |
                        | AI Coach processing            |
                        | Admin operations               |
                        +---------------+----------------+
                                        |
                        +---------------v----------------+
                        | RELATIONAL PERSISTENCE         |
                        | SQLAlchemy / SQL database      |
                        | Users, workouts, meals, goals  |
                        | Coach and feature records      |
                        | History, audit and AI records  |
                        +--------------------------------+
```

**Architecture rule:** the backend owns authorization and persistent business data. The clients provide the user experience and communicate with the service under the appropriate authenticated role. Shared data is the objective; client parity must still be tested rather than assumed.

### 1. Presentation layer — React website

The web interface is maintained here in `delphiafit-web`, using:

- **React 19** for component-based user interfaces and state.
- **React Router 7** for application routes and navigation.
- **Vite 8** for local development and production builds.
- **JavaScript, JSX and CSS** for UI behavior and styling.
- **Vitest, React Testing Library and jsdom** for frontend automated testing.
- **Vercel-related configuration and analytics** in the web repository.

The central route composition is `src/App.jsx`. Member features are primarily organized in `src/pages/`; restricted administration interfaces in `src/Admin/`; reusable UI elements in `src/components/`; frontend AI helpers in `src/ai/`; and integration and session utilities in `src/utils/` and `src/config/`.

Menu/navigation is coordinated with a menu context and role-aware coach navigation. The web application separates user, coach and admin session tokens at the client layer. **True authorization must remain enforced on the backend**, because hiding a page or menu item is not an access-control boundary.

### 2. API boundary — requests, sessions and contracts

`src/config/api.js` obtains the API base URL from `VITE_API_URL`. The shared `src/utils/api.js` request utility handles JSON requests, bearer authorization headers, user/coach/admin session selection, HTTP error handling and optional request timeouts. Expired member sessions can trigger a return to login.

For general user records, `src/utils/userDataApi.js` provides a CRUD-oriented interface:

```text
GET    /user-data/{collection}
POST   /user-data/{collection}
PUT    /user-data/{collection}/{id}
DELETE /user-data/{collection}/{id}
```

These are examples of **source-level frontend contracts**, not a substitute for validating the API running in the deployed environment. Android and iOS clients must call the correct live version of these interfaces, with secure platform-specific credential storage.

### 3. Application backend — Python and FastAPI

The backend lives in [mdelphia85/delphiafit-backend](https://github.com/mdelphia85/delphiafit-backend). Its repository contains:

- **FastAPI routers** under `app/routers/` for distinct functional areas.
- **Pydantic request and response models** and other validation structures.
- **SQLAlchemy ORM models** under `app/models/`.
- **Database session and migration support** under `app/database/`.
- **Authentication/authorization** and role-sensitive API operations.
- **Domain-specific services**, including AI-related code under `app/services/`.
- Container and deployment configuration including `Dockerfile` and `railway.toml`.

Backend development has involved multiple branches, including `repaired-backend` and feature/staging branches. **The backend default branch is not necessarily the deployed backend**, so source review and production behavior need to be reconciled before a release or cross-platform sync.

### 4. Data layer — shared, persistent records

The system uses a relational database accessed by SQLAlchemy. The database connection is configured from a server-side `DATABASE_URL`, not from the web client. Feature models and migrations cover different kinds of records including user profiles, fitness logs, nutritional information, coaching interactions and other platform domains.

The intended cross-platform contract is:

1. A person signs in to the same DelphiaFit account from an authorized client.
2. The client submits reads/writes to the backend API.
3. The backend validates the request, identifies the user and enforces record ownership or role authorization.
4. The database stores the authoritative record.
5. Subsequent reads from the website or mobile app return the same permitted data.

That design is critical for a seamless move from the gym floor to a desktop browser without exporting notebooks or manually re-entering workouts. **Actual cross-device synchronization requires end-to-end verification.**

### 5. AI Coach and nutrition capabilities

**AI Coach:** The web `AICoach.jsx` accepts conversational questions, sends `POST /ai/coach`, reads saved results from `GET /ai/records`, and renders responses and relevant error states. It supports fatigue and sleep inputs in the visible interface. The more recent backend AI implementation on `repaired-backend` includes persisted AI records, authenticated access, request idempotency and mechanisms for applying certain stored workout/adaptive inputs. The founder reports the website's AI Coach is live.

This is **primarily a conversational question-and-answer experience**. Do not mistake source-level personalization helpers for evidence that DelphiaFit autonomously writes, changes or prescribes complete individualized workout programs. Hosted-model configuration and production availability also need verification in each deployment.

**Nutrition Pro:** The web interface stores nutrition preferences, requests calculated calorie/macronutrient targets, generates meal plans and retrieves saved plans using `/nutrition-coach/*` endpoints. Its settings account for weight goals, diet choices, avoided ingredients and meal frequency. The plan generator is a distinct part of the product, not simply a fixed example meal plan.

### 6. Roles, ownership and administration

Different DelphiaFit users have different responsibilities. The codebase includes interfaces for members, coaches/trainers and restricted administration.

- **Members** access their own workout/nutrition history and permitted community functionality.
- **Coaches/trainers** use designated coaching, client-management, invitations, plans and messaging flows.
- **Owner/admin functionality** includes protected analytics, user administration, announcements, messages and audit features.

A web page is not sufficient proof of role safety. API authorization, user-data ownership, session expiration, administrative access boundaries and coach/client relationships should be validated by tests and deployed checks.

---

## What the platform covers

The website code contains many functional domains. Modules with a route, screen or ORM model are **not automatically claimed to be complete, integrated, monetized or production-verified**.

| Domain | Web modules / workflows |
| --- | --- |
| Workout tracking | Workouts, Free Training, Periodization, logs and performance history |
| Nutrition and wellness | Water, Calories, Protein, Meals, Supplements, Nutrition Pro and Recovery |
| Goals and analytics | Goals, Progress, Performance Dashboard, Athlete Analytics and Journal |
| Motivation | Challenges, Achievements, Streaks and Leaderboard |
| Coaching | Coach Hub, My Trainer, My Clients, client invitations, plans and messaging |
| Community | Community, Groups and social interactions |
| Sports | Sports, Sports Academy, recruiting, competitions and federations |
| Specialized training | Fire, EMS, Police, Military, tactical and preparation modules |
| Expanded product areas | DelphiaFit Kids, Pro, Marketplace, organization and other specialty screens |
| Platform operations | Login, registration, profile, settings, legal pages, administrative tools and audit features |

Some expanded modules depend on external integrations or future work. For instance, marketplace listings are not equivalent to completed payment processing, and AI/motion-related pages do not prove working camera analysis.

---

## Moving from the website to Android

The Android app **already exists** as a separate Android Studio project. The current effort is to take lessons and applicable website improvements and bring the existing app into alignment, rather than rebuild DelphiaFit from scratch.

**Planned integration approach:**

1. **Establish the Android baseline:** inspect the actual project, package/build configuration, navigation and API wiring. The working project is maintained separately from this web repository.
2. **Match backend contracts:** connect the Android client to the correct deployed HTTPS API and verify JSON request/response behavior.
3. **Align authentication and authorization:** support member/coach flows without exposing restricted admin capabilities. Use secure Android credential storage rather than copying the browser's localStorage approach.
4. **Bring core tracking to parity:** use the same backend records for workouts, meals, water, nutrition goals, progress and recovery.
5. **Integrate AI Coach and Nutrition Pro:** use the live backend features instead of placeholder/mock responses.
6. **Verify navigation, offline handling and devices:** check Android permissions, error states, data integrity, accessibility, app upgrades and physical-device behavior.
7. **Prepare distribution:** validate a signed release build, privacy disclosures and Google Play requirements before publication.

**Status:** Android development and parity verification are in progress. A functioning Android emulator build or an existing screen is not evidence that every web feature has been ported. The detailed Android working checklist is managed separately and **is not stored in this website repository**.

## Expanding to Apple / iOS

The next intended stage is an Apple-platform application, after the Android work reaches release readiness. **iOS development is planned, not presented as completed.**

The core architectural advantage is reuse of the existing server-side system:

- Keep FastAPI endpoints, business rules and database records shared across the web and mobile clients.
- Build an Apple-appropriate client interface and secure session storage.
- Match account ownership, training/nutrition records, coaching and AI behavior to the same API contracts.
- Handle Apple-specific packaging, privacy, permission, lifecycle, testing and App Store distribution requirements.
- Avoid duplicating authoritative business logic in each device app; new backend features should be designed to serve each supported client.

The implementation language, framework and deployment details for iOS will be finalized when that phase begins. This README does not imply that a released iOS build currently exists.

---

## Complete website page and route inventory (source snapshot: November 12, 2026)

This is a **source-derived inventory of every 107 explicit route declarations** in `src/App.jsx`, not a claim that all 107 are separate finished pages. Some routes are aliases, demonstrations or redirects; several specialty screens represent work in progress. Page labels below describe their *intended purpose*. Each route must still be evaluated for production behavior, real data, authorization, test coverage and mobile parity. Do not use a route count as a count of independently deployed capabilities.

### Public, onboarding and demonstration (19 routes)

| Website route | Component | Intended purpose |
| --- | --- | --- |
| `/` | `Landing` | Public entry page |
| `/home` | `Home` | Member home |
| `/demo` | `DemoDashboard` | Demo overview |
| `/demo/dashboard` | `DemoDashboard` | Demo overview |
| `/demo/workouts` | `DemoWorkouts` | Demo workouts |
| `/demo/meals` | `DemoMeals` | Demo meals |
| `/demo/tactical` | `DemoTactical` | Demo tactical training |
| `/demo/progress` | `DemoProgress` | Demo progress |
| `/demo/firefighter` | `DemoFirefighter` | Demo Firefighter |
| `/demo/ems` | `DemoEMS` | Demo EMS |
| `/demo/military` | `DemoMilitary` | Demo Military |
| `/demo/police` | `DemoPolice` | Demo Police |
| `/register` | `Register` | Account creation |
| `/login` | `Login` | Member sign-in |
| `/forgot-password` | `ForgotPassword` | Password recovery request |
| `/reset-password` | `ResetPassword` | Password reset |
| `/about` | `About` | Project information |
| `/privacy` | `PrivacyPolicy` | Privacy policy |
| `/terms` | `TermsOfService` | Terms of service |

### Member health, nutrition and performance (19 routes)

| Website route | Component | Intended purpose |
| --- | --- | --- |
| `/protein` | `Protein` | Protein tracking |
| `/water` | `Water` | Hydration tracking |
| `/meals` | `Meals` | Meal logging |
| `/calories` | `Calories` | Calorie tracking |
| `/profile` | `Profile` | Member profile |
| `/history` | `History` | Activity history |
| `/workouts` | `Workouts` | Workout records |
| `/supplements` | `Supplements` | Supplement tracking |
| `/goals` | `Goals` | Goal management |
| `/free-training` | `FreeTraining` | Unstructured workout logging |
| `/progress` | `Progress` | Progress measurement |
| `/journal` | `Journal` | Training journal |
| `/periodization` | `Periodization` | Training cycles |
| `/recovery` | `Recovery` | Recovery records |
| `/performance` | `PerformanceDashboard` | Performance overview |
| `/analytics` | `AthleteAnalytics` | Athlete analysis |
| `/nutrition-pro` | `NutritionPro` | Nutrition targets and generated plans |
| `/ai-coach` | `AICoach` | Conversational AI coaching |
| `/settings` | `Settings` | Account preferences |

### Trainer, coach and team operations (16 routes)

| Website route | Component | Intended purpose |
| --- | --- | --- |
| `/coach-dashboard` | `CoachDashboard` | Coach home and tools |
| `/coach-login` | `CoachLogin` | Coach authentication |
| `/coach/invite` | `CoachInviteAccept` | Trainer/client invite acceptance |
| `/invite` | `CoachInviteAccept` | Trainer/client invite acceptance |
| `/my-coach` | `ClientMessages` | Client-facing coach messages |
| `/coach/password-reset` | `CoachPasswordReset` | Coach password reset |
| `/client-management` | `TrainerClients` | Member-facing client/trainer relationship view |
| `/my-trainer` | `MyTrainer` | Connected trainer |
| `/coach/client-management` | `ClientManagement` | Coach client-management interface |
| `/plan-builder` | `PlanBuilder` | Training plan authoring |
| `/coach-messaging` | `CoachMessaging` | Coach messages |
| `/drill-library` | `DrillLibraries` | Training drill library |
| `/team-operations` | `TeamOperations` | Team roster and operations |
| `/team-communications` | `TeamCommunications` | Team messaging |
| `/team-performance` | `TeamPerformance` | Team performance |
| `/tactical/team-ops` | `TeamOperations` | Team roster and operations |

### Community, sports, competitions and expanded offerings (20 routes)

| Website route | Component | Intended purpose |
| --- | --- | --- |
| `/sports` | `Sports` | Sport-specific activity |
| `/community` | `Community` | Member discussion |
| `/leaderboard` | `Leaderboard` | Rankings |
| `/challenges` | `Challenges` | Training challenges |
| `/achievements` | `Achievements` | Earned milestones |
| `/streaks` | `Streaks` | Consistency tracking |
| `/groups` | `Groups` | Group/community membership |
| `/marketplace` | `CreatorMarketplace` | Creator marketplace listings |
| `/pro-analytics` | `DelphiaProAnalytics` | Advanced analytics interface |
| `/delphia-kids` | `DelphiaKids` | Youth-oriented interface |
| `/sports-academy` | `SportsAcademy` | Sport-specific training academy |
| `/recruiting-profiles` | `RecruitingProfiles` | Athlete recruiting profiles |
| `/competition-events` | `CompetitionEvents` | Event participation |
| `/organization` | `OrganizationLayer` | Organization workflows |
| `/global-competitions` | `GlobalCompetition` | Global competition layer |
| `/federations` | `FederationLayer` | Federation membership |
| `/performance-lab` | `AIPerformanceLab` | Performance analysis concept/UI |
| `/medical-rehab` | `MedicalRehab` | Recovery and rehab records |
| `/autonomous-coaching` | `AutonomousCoaching` | Autonomous coaching concept/UI |
| `/government-military` | `GovernmentMilitary` | Government and military domain |

### Tactical and occupational training (24 routes)

| Website route | Component | Intended purpose |
| --- | --- | --- |
| `/tactical/firefighters` | `Firefighters` | Firefighter training |
| `/tactical/ems` | `EMS` | EMS training |
| `/tactical/military` | `Military` | Military training |
| `/tactical/police` | `Police` | Police training |
| `/tactical/k9-operations` | `K9Operations` | K9 operations |
| `/tactical/search-rescue` | `SearchRescue` | Search and rescue |
| `/tactical/disaster-response` | `DisasterResponse` | Disaster-response training |
| `/tactical/maritime-operations` | `MaritimeOperations` | Maritime training |
| `/tactical/aviation-crew` | `AviationCrewReadiness` | Aviation readiness |
| `/tactical/hazmat-cbrn` | `HazmatCBRN` | Hazmat/CBRN training |
| `/tactical/wildland-fire` | `WildlandFire` | Wildland fire |
| `/tactical/fitness-civilian` | `TacticalFitnessCivilian` | Civilian tactical fitness |
| `/tactical/fire-academy` | `FireAcademyPrep` | Fire academy preparation |
| `/tactical/police-academy` | `PoliceAcademyPrep` | Police academy preparation |
| `/tactical/emt-paramedic` | `EMTParamedicPrep` | EMT/paramedic preparation |
| `/tactical/military-bootcamp` | `MilitaryBootcampPrep` | Military boot-camp preparation |
| `/tactical/sof-selection` | `SOFSelectionPrep` | Special operations selection preparation |
| `/tactical/swat-selection` | `SWATSelectionPrep` | SWAT selection preparation |
| `/tactical/scenario-simulator` | `ScenarioSimulator` | Scenario simulation interface |
| `/tactical/loadouts` | `LoadoutsManager` | Equipment/loadout planning |
| `/tactical/instructor` | `InstructorPortal` | Instructor workflow |
| `/tactical/mission-replay` | `MissionReplay` | Mission replay |
| `/tactical/certifications` | `CertificationsTracker` | Certification records |
| `/tactical/unit-builder` | `UnitBuilder` | Unit-building tools |

### Owner administration (9 routes)

| Website route | Component | Intended purpose |
| --- | --- | --- |
| `/admin` | `Navigate` | Redirect to admin sign-in |
| `/admin/login` | `AdminLogin` | Owner/admin sign-in |
| `/admin/dashboard` | `AdminDashboard` | Administration dashboard |
| `/admin/analytics` | `AdminAnalytics` | Platform analytics |
| `/admin/announcements` | `AdminAnnouncements` | Announcements management |
| `/admin/logs` | `AdminLogs` | Audit or activity logs |
| `/admin/messages` | `AdminMessages` | Administrative messages |
| `/admin/users` | `AdminUsers` | User administration |
| `/admin/users/:id` | `AdminUserDetail` | Individual user administration |


## How far DelphiaFit can go — product vision and engineering roadmap

DelphiaFit is not intended to stop at an individual exercise tracker. The guiding product test for every expansion is the same one that sparked the original idea: **does this reduce the number of disconnected tools someone needs to pursue their fitness goals?** The platform can grow from everyday member tracking into an ecosystem serving individuals, coaches, teams, athletes, facilities and specialized training organizations.

The categories below distinguish **existing website code**, **cross-platform work**, and **longer-term ambitions**. They are a vision, not a promise that every capability already works or will ship on a particular date.

### Stage 1 — Make the website trustworthy and cohesive

- Continue verifying each visible website page against its real backend and database, replacing mock metrics and placeholder data where present.
- Tighten authentication, coaching roles, owner-only administration, record ownership, accessible navigation, and user data export/deletion.
- Keep workouts, nutrition, water, recovery, goals, history and progress understandable as *one person's continuous timeline*.
- Improve regression testing, security review, migrations, monitoring and documentation for reliable releases.
- Resolve external-dependency limitations openly (payments, email delivery, camera motion processing, hardware integrations) before advertising them as delivered.

**Outcome sought:** a dependable end-to-end web product, rather than an impressive set of disconnected screens.

### Stage 2 — Android release and multi-device continuity

- Finish the existing Android application rather than start again.
- Reconcile Android screens, API requests, sessions, saved records, AI Coach and Nutrition Pro against the working website and deployed backend.
- Validate secure Android credential storage, navigation, networking, recovery from errors and device compatibility.
- Test with actual user/coach accounts and the same authoritative data as the browser; publish only after Google Play release checks pass.
- Maintain the detailed migration checklist privately with the project rather than committing it to this website repository.

**Outcome sought:** a user can begin tracking at the gym on Android and continue later on the website without losing context or duplicating entries.

### Stage 3 — Apple / iOS client

- Design an iOS experience appropriate for Apple devices using a framework chosen during that project.
- Reuse existing FastAPI contracts, database records, account permissions and service-side business logic.
- Build and validate iOS-specific credential protection, lifecycle handling, accessibility, privacy and App Store packaging.
- Audit feature equivalence rather than assuming that a web page automatically becomes an iOS screen.

**Outcome sought:** one DelphiaFit account and consistent information across web, Android and iOS. iOS is **planned**, not currently implemented.

### Stage 4 — Deeper support for individual training and coaching

**Product directions to evaluate and build incrementally:**

- Richer goal histories with workout, nutrition and recovery trends in one view.
- Better plan creation/assignment, coach-client communication and training adherence tools.
- Progress reports that explain changes and uncertainties without pretending estimates are medical diagnoses.
- Configurable training templates for strength, endurance, sports and user-defined routines.
- Responsible use of AI to answer questions and assist with explanations, while keeping users and qualified professionals in control of consequential training decisions.

### Stage 5 — Teams, sports, gyms and communities

The website already has page structures for coaching, teams, recruiting, competitions and community participation. Long-term directions include:

- Shared team rosters, permissions, communication and measurable training outcomes.
- Trainer and facility workflows that reduce tool-switching for client management and programming.
- Community challenges, milestones and opt-in competitions that respect member privacy.
- Sport-specific programs and athlete development pathways, including MMA and other competitive disciplines.
- Clearly scoped youth/guardian controls for any child-facing feature.

### Stage 6 — Professional and specialized training

Existing routes indicate exploration of firefighter, EMS, police, military and other operational-fitness domains. These could become deeper role-specific programs with relevant drills, measurable readiness and team coordination, **only after subject-matter validation, reliability work and permissions are appropriate**. Do not represent training support as professional certification, official agency endorsement or medical clearance.

### Stage 7 — Optional ecosystem integrations

Evaluate integrations that reduce friction, such as approved wearable/health-data connections, exercise-device data, reminders, scheduling or third-party services. Each should require clear user consent, secure API design, understandable data ownership and an actual benefit over manual tracking. Marketplace transactions or advanced AI motion features should only be introduced as operational features after the associated technical and compliance work is complete.

### Engineering principles that keep expansion manageable

1. **One account and authoritative backend**, not unrelated web and mobile databases.
2. **Modular domains** so workouts, nutrition, coaching, community and specialties can evolve independently without duplicating core authentication.
3. **Stable versioned API contracts** and tests before each client depends on a new endpoint.
4. **Privacy, consent and access boundaries** appropriate to fitness, health-adjacent and youth-related information.
5. **Reliable core functionality first**, then expanded modules as they are tested and validated.
6. **Honest release status:** a page, model or prototype is not automatically a live product feature.
7. **Accessibility and cost-conscious design** consistent with the original frustration that motivated DelphiaFit.

### The north star

The original notebook and multiple subscriptions are the problem to solve, not merely the origin story. Whether someone is working toward their first fitness goal, training alongside professional fighters, coaching clients, or managing a team, DelphiaFit should make their journey **more connected, less fragmented and easier to manage**.

**Every Goal on One Platform.**

## Local web development

```bash
git clone https://github.com/mdelphia85/delphiafit-web.git
cd delphiafit-web
npm ci
```

Configure the non-secret backend base URL locally in `.env.local`:

```dotenv
VITE_API_URL=https://your-approved-backend-host.example
```

The URL above is a **placeholder**, not a confirmed production address. Do not put credentials, database URLs or secret API keys in `VITE_*` variables: Vite includes client-side environment values in browser bundles.

```bash
npm run dev
```

Vite normally prints an available local address such as `http://localhost:5173`. To access account-backed features, the corresponding backend must be reachable and configured.

### Validation commands

```bash
npm run test
npm run lint
npm run build
npm run preview
```

- **Tests** provide automated component/contract feedback but can use mocked network traffic.
- **Lint** catches code-quality issues; the historical progress report records older unresolved lint findings.
- **Build** confirms frontend bundling, not correct backend behavior.
- **Manual end-to-end testing** must exercise the browser, authenticated API, database and relevant roles before declaring a release ready.

## Deployment, security and reliability

The frontend contains Vercel-related configuration; the backend includes container and Railway-related configuration. Confirm actual infrastructure, runtime branch/commit and environment settings before changing production.

Core practices include verifying server-side authorization for every sensitive route, account ownership of user records, HTTPS transport, migrations on a nonproduction database copy first, error handling, monitoring, clear separation of demo and live data, and no fabrication of missing analytics values.

The web's token handling and the future mobile clients' credential handling are different security contexts. Shared API authentication does not mean copying browser session storage into Android or iOS.

## Repository map and engineering evidence

```text
delphiafit-web/
├── src/
│   ├── App.jsx               # route and menu composition
│   ├── pages/                # member, coach and specialty screens
│   ├── Admin/                # restricted admin UI
│   ├── components/           # reusable components
│   ├── ai/                   # frontend AI helpers
│   ├── utils/                # HTTP, sessions and user data
│   ├── config/               # API configuration
│   └── demo/                 # demonstration data/screens
├── docs/
│   └── DEVELOPMENT_HISTORY.md
├── PROGRESS_REPORT.md       # historical snapshot, not current release certification
├── package.json
└── vite.config.js
```

For the more detailed chronology, source evidence and limitations, see the [creation and development history](docs/DEVELOPMENT_HISTORY.md).

**Related source repositories:**
- [DelphiaFit Web](https://github.com/mdelphia85/delphiafit-web)
- [DelphiaFit Backend](https://github.com/mdelphia85/delphiafit-backend)
- [Original Gym App prototype](https://github.com/mdelphia85/gym-App)

---

### Long-term direction

DelphiaFit began as an injury-time idea, a notebook-replacement problem and a way to learn to code. It has grown into a software engineering project that connects a fitness community, training data, nutritional planning, coaching, and AI-supported questions across a shared platform.

The goal has not changed: **reduce the fragmentation of fitness technology so that people can spend less time managing tools and more time pursuing their goals.**

**Every Goal on One Platform.**
