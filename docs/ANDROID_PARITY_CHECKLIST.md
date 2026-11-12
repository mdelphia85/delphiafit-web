# DelphiaFit Android — Web-to-Mobile Parity and Release Checklist

**Baseline date:** 2026-11-12. **Web reference:** `mdelphia85/delphiafit-web` `main`, backend `repaired-backend` for newer API contracts.  
**Android source:** not present among accessible GitHub repositories. Every line below is an **audit / implement if missing**, not a claim that the current app lacks it.  
**Priority:** P0 = release blocker/security/data integrity; P1 = core parity; P2 = specialty/optional scope.  
**Evidence of completion:** Android source path + app version/commit + emulator/physical-device test + working backend response. A screen that merely opens is not done.

## Release-critical foundations — P0

- [ ] Obtain and version the Android Studio project; record package ID, versionCode/versionName, min/target SDK, build flavors, Gradle dependencies and commit SHA.
- [ ] Confirm Android talks to the **deployed** HTTPS API; do not ship emulator localhost, hard-coded dev addresses, test passwords, or secret keys.
- [ ] Align all request/response contracts with the deployed backend branch; confirm error parsing, timeouts, retry and idempotency for writes.
- [ ] Verify login, registration, token refresh/expiration, explicit logout, password reset and secure token storage.
- [ ] Separate member, coach and owner-only admin authorization. Verify mobile users cannot access private admin APIs or another user's records.
- [ ] Confirm all user data changes persist to backend and survive application restart, sign out/in and device change; no fake/static dashboard numbers.
- [ ] Handle no connectivity, lost sessions, rate limits, duplicate submissions, server failures and loading/empty/error states across every feature.
- [ ] Protect sensitive information: HTTPS, least-privilege permissions, secret handling, safe logging, data deletion and privacy disclosures.
- [ ] Confirm client-side navigation and Back behavior never incorrectly log out a coach/member; test Return to Menu from every relevant screen.
- [ ] Test clean install, upgrade migration, orientation, small/large screens and process death on emulator **and** at least one physical Android device.
- [ ] Check accessibility (content descriptions, contrast, touch targets), branding, legal links, Play Store privacy/data-safety declarations.
- [ ] Build signed release AAB, verify crash-free critical flows, run release build against production/staging appropriately and prepare a rollback plan.

## Primary member and fitness workflows — P1

- [ ] Account: Profile, Goals, Settings, password change, notification preferences, data export and account deletion.
- [ ] Tracking: Water, Protein, Calories, Meals, daily logs, History and Journal.
- [ ] Fitness: Workouts, Free Training, training plans, Periodization, progress measurements, recovery and supplements.
- [ ] Insights: Progress, Performance Dashboard and Athlete Analytics using real persisted records.
- [ ] Motivation: Challenges, Achievements and Streaks; verify consistent date/time boundaries and totals.
- [ ] Nutrition Pro: Profile-derived calorie/macronutrient targets, diet/ingredient exclusions, goal preferences, saved settings, meal-plan generation and past plans. Check endpoint contracts and numeric validation.
- [ ] AI Coach: free-form question input, `POST /ai/coach`, fatigue/sleep inputs, response rendering, limited-model fallback, history from `GET /ai/records`, sign-in errors, server timeout and idempotency key for retries.
- [ ] Adaptive Coach features, if shown on Android: verify only supported behavior and stored profile; do not imply autonomous plan modification without an actual implemented workflow.

## Trainer / coach and social — P1

- [ ] Coach login and coach-session persistence, Coach Dashboard and role-specific menu.
- [ ] Coach invitations and acceptance, My Trainer, My Clients / client management, trainer/client permissions and privacy.
- [ ] Plan Builder, assigning plans, client messages, Coach Messaging and team communications; verify real sender/recipient persistence.
- [ ] Coach password recovery, Return to Menu, and navigation back into existing member session.
- [ ] Community posts/comments/reactions/follows, Groups, Leaderboard and profile visibility.
- [ ] Sports and Sports Academy; competitions, global events, recruiting profiles and federation flows where intended for mobile.
- [ ] DelphiaFit Kids safeguards/roles and Creator Marketplace listings. Do not display purchase/payment capability unless fully integrated.

## Specialized program inventory — P2 unless promised at launch

- [ ] Firefighters, EMS, Police, Military and civilian tactical fitness.
- [ ] K9, Search & Rescue, Disaster Response, Maritime, Aviation, HazMat/CBRN and Wildland Fire.
- [ ] Fire Academy, Police Academy, EMT/Paramedic, Military Bootcamp, SOF and SWAT preparation.
- [ ] Scenario Simulator, Loadouts, Instructor Portal, Mission Replay, Certifications, Unit Builder and tactical logs.
- [ ] DelphiaFit Pro Analytics, AI Performance Lab, Autonomous Coaching, Medical/Rehab, Government/Military and Organization features. Validate limitations: no camera/motion tracking unless implemented, and medical records are not clinical advice.
- [ ] Clarify whether owner-only Admin Dashboard, Users, Analytics, Messages, Announcements and Logs belong in Android at all. **Do not blindly expose owner admin screens to members.**

## Parity verification protocol

For each feature capture: **web route | web source file | backend endpoint(s) | Android Activity/Fragment/Compose destination | current Android state (present/missing/partial) | action | priority | test ID | result**.

1. Inventory Android routes/screens and API calls from real Android source.
2. Match against `src/App.jsx`, relevant `src/pages/*`, `src/Admin/*`, `src/utils/api.js`, and the **actually deployed** backend OpenAPI specification.
3. Compare payloads, persistence and error behavior — not just UI labels.
4. Execute full member, coach and admin-negative authorization tests on a clean app install, then a second device.
5. Record pass/fail with screenshots or logs; do not check a line off solely because it exists in source.

## Known qualifications carried from web documentation

- The repository's `PROGRESS_REPORT.md` is a **historical snapshot**, not proof that Coach Hub is still broken or that deployments have not happened since.
- Older report gaps included coach navigation/session, SMTP-dependent email, marketplace payments, camera tracking and production browser/PostgreSQL validation. Reconfirm current status before carrying functionality into Android.
- User reports the **website and AI are live** and the **Android app exists**. This checklist is specifically the task of migrating/confirming applicable changes and attaining Android release readiness.
