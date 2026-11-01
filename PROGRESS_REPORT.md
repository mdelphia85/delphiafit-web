# DelphiaFit production upgrade: progress report

Branch: `feature/production-upgrade` in both repos. Nothing has been pushed, merged or deployed. No production database or environment variable was touched.

| Repo | Location | Commit |
|---|---|---|
| Frontend | `delphiafit-web` | `d928159` (on top of nutrition work `7768575`) |
| Backend | `backend\.nutrition-wt` worktree, based on `origin/repaired-backend` (the live branch) | `3d0f74a` (on top of `115d5f6`) |

Already live from earlier approved work: nutrition integration (`7768575` frontend on `main`; `bc2217d` and `115d5f6` backend on `repaired-backend`).

## How "tested" is defined here

- **Backend tests** use a temporary sqlite database and the real FastAPI app. They are meaningful for authorization, ownership and persistence.
- **Frontend tests** use Vitest with `fetch` mocked. They prove the page calls the intended endpoint and renders states. They do NOT prove the page works against the deployed API.
- **No screen has been verified in a real browser or against a running backend, and nothing has run on Postgres.**
- Last full run: backend 162 passed, frontend 78 passed, `npm run build` passes, lint 35 errors (baseline was 125, none in new files).

## Coach Hub: reported NOT fixed by the owner

The owner reports that Coach Hub is still not fixed. My automated tests pass, but they are mocked and cannot reproduce the deployed behavior. Treat Coach Hub as BROKEN/UNVERIFIED until reproduced in a browser.

- Files: `CoachDashboard`, `CoachLogin`, `CoachInviteAccept`, `CoachPasswordReset`, `ClientManagement`, `PlanBuilder`, `CoachMessaging`, `DrillLibraries`, `TeamOperations`, `TeamCommunications`, `TeamPerformance`, `ClientMessages`.
- Unverified suspects:
  - Frontend and backend coach login contract (response fields, token key `coachToken`).
  - The deployed backend is still the old build, so coach routes and the changed `/team` and `/invite` auth are not live yet. Until the backend is deployed, the new frontend will fail against production.
  - `/tactical/team-ops` now requires a coach session.
  - The Return to Menu entry in `src/App.jsx` and `MenuContext`.
- Needed next: run both apps locally, log in as a coach, click every dashboard button, and capture the failing request or error.

## Screen status

Legend: Implemented = code complete and covered by automated tests. Partial = works but has stated gaps. Unverified = no real-browser check.

### Admin (backend: `tests/test_admin.py`; frontend: `Admin.test.jsx`)
- Implemented, tested (automated): Login, Dashboard, Analytics, Users, UserDetail (new route `/admin/users/:id`), Messages, Announcements, Logs.
- Gaps: no user-facing UI for the announcement feed or for sending a message (endpoints exist only); suspended users keep a valid token until it expires (about 60 min); `routers/users.py` still trusts the admin flag in the token.

### Core tracking (`test_user_data_records.py`, `test_zz_account_insights.py`, `coreTracking.test.jsx`, `insightsSettings.test.jsx`)
- Implemented, tested: Water, DailyLog, History, Journal, Supplements, Recovery, Workouts, FreeTraining, Periodization, Challenges, Streaks, Achievements, Progress, PerformanceDashboard, AthleteAnalytics, Settings (change password, export, delete account, notification preferences).
- Gaps: UTC day boundaries; account deletion tested on sqlite only; notification and test emails need `SMTP_HOST` and `SMTP_FROM`.

### Nutrition (live, `test_nutrition_coach.py`)
- Calories, Protein, Meals, Goals, Profile, NutritionPro: implemented and tested.
- Gap: vegan plans miss the tolerance at high protein targets, and the plan says so.

### Community, sports, competition (`test_social_api.py`, `test_community_area_api.py`, several frontend tests)
- Implemented, tested: Community (posts, comments, reactions, follows), Groups, Leaderboard, Sports, SportsAcademy, CompetitionEvents, GlobalCompetition, FederationLayer, RecruitingProfiles, DelphiaKids, CreatorMarketplace listings and interest requests.
- Blocked: marketplace payments (no payment integration; not simulated).

### Tactical (`test_tactical_progress.py`, `test_legacy_tactical_auth.py`, several frontend tests)
- Implemented, tested: Firefighters, EMS, Military, Police, K9, SearchRescue, Disaster, Maritime, Aviation, Hazmat, Wildland, TacticalFitnessCivilian, the six `*Prep` pages, Loadouts, ScenarioSimulator, InstructorPortal, CertificationsTracker, UnitBuilder, MissionReplay.
- Gap: `/tactical/team-ops` is the coach `TeamOperations` page.

### Pro, enterprise, auth, public (`test_pro_area_auth.py`, `AuthFlow.test.jsx`, `NutritionPro.test.jsx`, `MedicalRehab.test.jsx`)
- Implemented, tested: AICoach (rule-based, with on-device adaptive card), AutonomousCoaching, OrganizationLayer, Login, Register, Landing, About, legal pages and footer. Team Roster/Comms/Performance use social groups for regular users (Coach Hub stays coach-only).
- Partial: DelphiaProAnalytics, AIPerformanceLab (no camera tracking), MedicalRehab (records only), GovernmentMilitary, ForgotPassword and ResetPassword (email needs SMTP). Enterprise, Integrations and Permissions were removed.

### Demos
- `/demo/*` pages and `src/demo/*` left untouched and separate from production data.

## Migrations (additive, idempotent, `python -m app.database.migrate`)

- New tables: `coach_messages`, `plan_assignments`, `admin_audit_logs`, `user_data_records`, `tactical_progress`, `ai_records`, `organization_memberships`, the community-area tables, plus nutrition tables from earlier work.
- New nullable columns: `users` (suspension fields), `announcements`, `tactical_drills.completed`, competitions, seasons, scenarios, units, `user_profiles` (sex, activity level).
- Verified: an existing user row survived two runs on sqlite. NOT verified on Postgres.

## Still broken or unfinished

1. Coach Hub (see above).
2. Nothing verified in a browser or against Postgres.
3. Email delivery (invites, resets, notifications) needs SMTP configuration.
4. Payments, hardware vendor OAuth, enterprise telemetry, camera tracking: external integrations, not built.
5. Client invite form still asks for a password even for existing accounts; no schedule-creation UI in the coach dashboard.
6. Pre-existing: 35 lint errors; smoke scripts `integration_smoke.py` and `validate_backend.py` use `/tmp` paths and were not adapted or run.
7. Untracked `src/pages/CreateAccount.jsx` is an unrouted draft; left untouched.

## Deployment prerequisites (approval required)

1. Reproduce and fix Coach Hub locally.
2. Run migrations against a copy of production data on Postgres.
3. Browser smoke test of the main flows.
4. Deploy the backend first (`repaired-backend`, Railway pre-deploy migration), then the frontend (`main`).
5. Rollback: `git revert 3d0f74a` (backend) and `git revert d928159` (frontend); the new tables and columns are harmless to leave.
