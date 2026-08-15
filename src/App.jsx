import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useContext } from "react";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Protein from "./pages/Protein.jsx";
import Water from "./pages/Water.jsx";
import Meals from "./pages/Meals.jsx";
import Calories from "./pages/Calories.jsx";
import Profile from "./pages/Profile.jsx";
import History from "./pages/History.jsx";

import Workouts from "./pages/Workouts.jsx";
import Supplements from "./pages/Supplements.jsx";
import Goals from "./pages/Goals.jsx";
import Sports from "./pages/Sports.jsx";
import FreeTraining from "./pages/FreeTraining.jsx";
import Progress from "./pages/Progress.jsx";
import Journal from "./pages/Journal.jsx";
import Community from "./pages/Community.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Challenges from "./pages/Challenges.jsx";
import Achievements from "./pages/Achievements.jsx";
import Streaks from "./pages/Streaks.jsx";
import Groups from "./pages/Groups.jsx";
import Periodization from "./pages/Periodization.jsx";
import Recovery from "./pages/Recovery.jsx";
import PerformanceDashboard from "./pages/PerformanceDashboard.jsx";
import AthleteAnalytics from "./pages/AthleteAnalytics.jsx";
import CoachDashboard from "./pages/CoachDashboard.jsx";
import CoachLogin from "./pages/CoachLogin.jsx";
import CoachInviteAccept from "./pages/CoachInviteAccept.jsx";
import CoachPasswordReset from "./pages/CoachPasswordReset.jsx";
import ClientManagement from "./pages/ClientManagement.jsx";
import PlanBuilder from "./pages/PlanBuilder.jsx";
import CoachMessaging from "./pages/CoachMessaging.jsx";
import DrillLibraries from "./pages/DrillLibraries.jsx";
import CreatorMarketplace from "./pages/CreatorMarketplace.jsx";
import HardwareIntegrations from "./pages/HardwareIntegrations.jsx";
import EnterpriseDashboard from "./pages/EnterpriseDashboard.jsx";
import DelphiaProAnalytics from "./pages/DelphiaProAnalytics.jsx";
import DelphiaKids from "./pages/DelphiaKids.jsx";
import NutritionPro from "./pages/NutritionPro.jsx";
import SportsAcademy from "./pages/SportsAcademy.jsx";
import AICoach from "./pages/AICoach.jsx";
import TeamOperations from "./pages/TeamOperations.jsx";
import TeamCommunications from "./pages/TeamCommunications.jsx";
import TeamPerformance from "./pages/TeamPerformance.jsx";
import RecruitingProfiles from "./pages/RecruitingProfiles.jsx";
import CompetitionEvents from "./pages/CompetitionEvents.jsx";
import PermissionsLayer from "./pages/PermissionsLayer.jsx";
import OrganizationLayer from "./pages/OrganizationLayer.jsx";
import GlobalCompetition from "./pages/GlobalCompetition.jsx";
import FederationLayer from "./pages/FederationLayer.jsx";
import AIPerformanceLab from "./pages/AIPerformanceLab.jsx";
import MedicalRehab from "./pages/MedicalRehab.jsx";
import AutonomousCoaching from "./pages/AutonomousCoaching.jsx";
import GovernmentMilitary from "./pages/GovernmentMilitary.jsx";
import About from "./pages/About.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// DEMO
import Landing from "./pages/Landing.jsx";
import DemoDashboard from "./pages/demo/DemoDashboard.jsx";
import DemoWorkouts from "./pages/demo/DemoWorkouts.jsx";
import DemoMeals from "./pages/demo/DemoMeals.jsx";
import DemoTactical from "./pages/demo/DemoTactical.jsx";
import DemoProgress from "./pages/demo/DemoProgress.jsx";
import DemoFirefighter from "./pages/demo/DemoFirefighter.jsx";
import DemoEMS from "./pages/demo/DemoEMS.jsx";
import DemoMilitary from "./pages/demo/DemoMilitary.jsx";
import DemoPolice from "./pages/demo/DemoPolice.jsx";

// ADMIN
import AdminLogin from "./Admin/Login.jsx";
import AdminDashboard from "./Admin/Dashboard.jsx";
import AdminAnalytics from "./Admin/Analytics.jsx";
import AdminAnnouncements from "./Admin/Announcements.jsx";
import AdminLogs from "./Admin/Logs.jsx";
import AdminMessages from "./Admin/Messages.jsx";
import AdminUsers from "./Admin/Users.jsx";

// SETTINGS (moved out of admin)
import Settings from "./pages/Settings.jsx";

// TACTICAL REAL APP
import Firefighters from "./pages/Firefighters.jsx";
import EMS from "./pages/EMS.jsx";
import Military from "./pages/Military.jsx";
import Police from "./pages/Police.jsx";
// TACTICAL SPECIALIZED TRAINING
import K9Operations from "./pages/K9Operations.jsx";
import SearchRescue from "./pages/SearchRescue.jsx";
import DisasterResponse from "./pages/DisasterResponse.jsx";
import MaritimeOperations from "./pages/MaritimeOperations.jsx";
import AviationCrewReadiness from "./pages/AviationCrewReadiness.jsx";
import HazmatCBRN from "./pages/HazmatCBRN.jsx";
import WildlandFire from "./pages/WildlandFire.jsx";
import TacticalFitnessCivilian from "./pages/TacticalFitnessCivilian.jsx";

// ACADEMY PREP
import FireAcademyPrep from "./pages/FireAcademyPrep.jsx";
import PoliceAcademyPrep from "./pages/PoliceAcademyPrep.jsx";
import EMTParamedicPrep from "./pages/EMTParamedicPrep.jsx";
import MilitaryBootcampPrep from "./pages/MilitaryBootcampPrep.jsx";
import SOFSelectionPrep from "./pages/SOFSelectionPrep.jsx";
import SWATSelectionPrep from "./pages/SWATSelectionPrep.jsx";

// TACTICAL CORE SYSTEMS
import ScenarioSimulator from "./pages/ScenarioSimulator.jsx";
import LoadoutsManager from "./pages/LoadoutsManager.jsx";
import InstructorPortal from "./pages/InstructorPortal.jsx";
import MissionReplay from "./pages/MissionReplay.jsx";
import CertificationsTracker from "./pages/CertificationsTracker.jsx";
import UnitBuilder from "./pages/UnitBuilder.jsx";

import { MenuProvider, MenuContext } from "./context/MenuContext.jsx";

function App() {
  return (
    <MenuProvider>
      <MenuOverlay />
      <AppWithMenu />
    </MenuProvider>
  );
}

/* ---------------- MENU OVERLAY ---------------- */

function MenuOverlay() {
  const { menuOpen, setMenuOpen } = useContext(MenuContext);
  const navigate = useNavigate();

  function go(path) {
    navigate(path);
    setMenuOpen(false);
  }

  function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/login");
  }

  if (!menuOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "100px",
        left: "20px",
        backgroundColor: "black",
        padding: "20px",
        borderRadius: "10px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "260px",
        border: "2px solid white",
        maxHeight: "80vh",
        overflowY: "auto",
        boxSizing: "border-box"
      }}
    >
      <MenuItem label="Protein" onClick={() => go("/protein")} />
      <MenuItem label="Water" onClick={() => go("/water")} />
      <MenuItem label="Calories" onClick={() => go("/calories")} />
      <MenuItem label="Profile" onClick={() => go("/profile")} />
      <MenuItem label="Meals" onClick={() => go("/meals")} />

      <MenuItem label="Supplements" onClick={() => go("/supplements")} />
      <MenuItem label="Workouts" onClick={() => go("/workouts")} />
      <MenuItem label="Sports" onClick={() => go("/sports")} />
      <MenuItem label="Free Training" onClick={() => go("/free-training")} />
      <MenuItem label="Goals" onClick={() => go("/goals")} />
      <MenuItem label="Progress" onClick={() => go("/progress")} />
      <MenuItem label="Journal" onClick={() => go("/journal")} />
      <MenuItem label="Community" onClick={() => go("/community")} />
      <MenuItem label="Leaderboard" onClick={() => go("/leaderboard")} />
      <MenuItem label="Challenges" onClick={() => go("/challenges")} />
      <MenuItem label="Achievements" onClick={() => go("/achievements")} />
      <MenuItem label="Streaks" onClick={() => go("/streaks")} />
      <MenuItem label="Groups" onClick={() => go("/groups")} />

      <MenuItem label="Periodization" onClick={() => go("/periodization")} />
      <MenuItem label="Recovery" onClick={() => go("/recovery")} />
      <MenuItem label="Performance" onClick={() => go("/performance")} />
      <MenuItem label="Analytics" onClick={() => go("/analytics")} />

      <MenuItem label="Coach Hub Login" onClick={() => go("/coach-login")} />
      <MenuItem label="My Clients" onClick={() => go("/client-management")} />
      <MenuItem label="Plan Builder" onClick={() => go("/plan-builder")} />
      <MenuItem label="Drill Library" onClick={() => go("/drill-library")} />
      <MenuItem label="Coach Messages" onClick={() => go("/coach-messaging")} />

      <MenuItem label="Marketplace" onClick={() => go("/marketplace")} />
      <MenuItem label="Integrations" onClick={() => go("/integrations")} />
      <MenuItem label="Enterprise" onClick={() => go("/enterprise")} />
      <MenuItem label="DelphiaFit Pro" onClick={() => go("/pro-analytics")} />
      <MenuItem label="DelphiaFit Kids" onClick={() => go("/delphia-kids")} />
      <MenuItem label="Nutrition Pro" onClick={() => go("/nutrition-pro")} />
      <MenuItem label="Sports Academy" onClick={() => go("/sports-academy")} />
      <MenuItem label="AI Coach" onClick={() => go("/ai-coach")} />
      <MenuItem label="Team Roster" onClick={() => go("/team-operations")} />
      <MenuItem label="Team Comms" onClick={() => go("/team-communications")} />
      <MenuItem label="Team Performance" onClick={() => go("/team-performance")} />
      <MenuItem label="Recruiting" onClick={() => go("/recruiting-profiles")} />
      <MenuItem label="Competition" onClick={() => go("/competition-events")} />
      <MenuItem label="Permissions" onClick={() => go("/permissions")} />
      <MenuItem label="Organization" onClick={() => go("/organization")} />

      <MenuItem label="Global Competitions" onClick={() => go("/global-competitions")} />
      <MenuItem label="Federations" onClick={() => go("/federations")} />
      <MenuItem label="Performance Lab" onClick={() => go("/performance-lab")} />
      <MenuItem label="Medical + Rehab" onClick={() => go("/medical-rehab")} />
      <MenuItem label="Autonomous Coaching" onClick={() => go("/autonomous-coaching")} />
      <MenuItem label="Government + Military" onClick={() => go("/government-military")} />

      <MenuItem label="About" onClick={() => go("/about")} />

      <MenuItem label="Firefighters" onClick={() => go("/tactical/firefighters")} />
      <MenuItem label="EMS" onClick={() => go("/tactical/ems")} />
      <MenuItem label="Military" onClick={() => go("/tactical/military")} />
      <MenuItem label="Police" onClick={() => go("/tactical/police")} />

  {/* TACTICAL SPECIALIZED TRAINING */}
  <MenuItem label="K9 Operations" onClick={() => go("/tactical/k9-operations")} />
  <MenuItem label="Search & Rescue" onClick={() => go("/tactical/search-rescue")} />
  <MenuItem label="Disaster Response" onClick={() => go("/tactical/disaster-response")} />
  <MenuItem label="Maritime Operations" onClick={() => go("/tactical/maritime-operations")} />
  <MenuItem label="Aviation Crew Readiness" onClick={() => go("/tactical/aviation-crew")} />
  <MenuItem label="Hazmat & CBRN" onClick={() => go("/tactical/hazmat-cbrn")} />
  <MenuItem label="Wildland Fire" onClick={() => go("/tactical/wildland-fire")} />
  <MenuItem label="Tactical Fitness" onClick={() => go("/tactical/fitness-civilian")} />

  {/* ACADEMY PREP */}
  <MenuItem label="Fire Academy Prep" onClick={() => go("/tactical/fire-academy")} />
  <MenuItem label="Police Academy Prep" onClick={() => go("/tactical/police-academy")} />
  <MenuItem label="EMT/Paramedic Prep" onClick={() => go("/tactical/emt-paramedic")} />
  <MenuItem label="Military Bootcamp Prep" onClick={() => go("/tactical/military-bootcamp")} />
  <MenuItem label="SOF Selection Prep" onClick={() => go("/tactical/sof-selection")} />
  <MenuItem label="SWAT Selection Prep" onClick={() => go("/tactical/swat-selection")} />

  {/* TACTICAL CORE SYSTEMS */}
  <MenuItem label="Scenario Simulator" onClick={() => go("/tactical/scenario-simulator")} />
  <MenuItem label="Loadouts Manager" onClick={() => go("/tactical/loadouts")} />
  <MenuItem label="Team Operations" onClick={() => go("/tactical/team-ops")} />
  <MenuItem label="Instructor Portal" onClick={() => go("/tactical/instructor")} />
  <MenuItem label="Mission Replay" onClick={() => go("/tactical/mission-replay")} />
  <MenuItem label="Certifications" onClick={() => go("/tactical/certifications")} />
  <MenuItem label="Unit Builder" onClick={() => go("/tactical/unit-builder")} />

      {/* UPDATED SETTINGS ROUTE */}
      <MenuItem label="Settings" onClick={() => go("/settings")} />

      <div
        onClick={logout}
        style={{
          color: "white",
          fontSize: "20px",
          textDecoration: "underline",
          fontWeight: "500",
          marginTop: "10px",
          cursor: "pointer"
        }}
      >
        Log Out
      </div>
    </div>
  );
}

/* ---------------- ROUTES ---------------- */

function AppWithMenu() {
  return (
    <Routes>
      {/* DEMO */}
      <Route path="/" element={<Landing />} />
      <Route path="/demo" element={<DemoDashboard />} />
      <Route path="/demo/dashboard" element={<DemoDashboard />} />
      <Route path="/demo/workouts" element={<DemoWorkouts />} />
      <Route path="/demo/meals" element={<DemoMeals />} />
      <Route path="/demo/tactical" element={<DemoTactical />} />
      <Route path="/demo/progress" element={<DemoProgress />} />
      <Route path="/demo/firefighter" element={<DemoFirefighter />} />
      <Route path="/demo/ems" element={<DemoEMS />} />
      <Route path="/demo/military" element={<DemoMilitary />} />
      <Route path="/demo/police" element={<DemoPolice />} />

      {/* AUTH */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* REAL APP */}
      <Route path="/protein" element={<Protein />} />
      <Route path="/water" element={<Water />} />
      <Route path="/meals" element={<Meals />} />
      <Route path="/calories" element={<Calories />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/history" element={<History />} />

      <Route path="/workouts" element={<Workouts />} />
      <Route path="/supplements" element={<Supplements />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/free-training" element={<FreeTraining />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/community" element={<Community />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/streaks" element={<Streaks />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/periodization" element={<Periodization />} />
      <Route path="/recovery" element={<Recovery />} />
      <Route path="/performance" element={<PerformanceDashboard />} />
      <Route path="/analytics" element={<AthleteAnalytics />} />
      <Route path="/coach-dashboard" element={<CoachDashboard />} />
      <Route path="/coach-login" element={<CoachLogin />} />
      <Route path="/coach/invite" element={<CoachInviteAccept />} />
      <Route path="/coach/password-reset" element={<CoachPasswordReset />} />
      <Route path="/client-management" element={<ClientManagement />} />
      <Route path="/plan-builder" element={<PlanBuilder />} />
      <Route path="/coach-messaging" element={<CoachMessaging />} />
      <Route path="/drill-library" element={<DrillLibraries />} />
      <Route path="/marketplace" element={<CreatorMarketplace />} />
      <Route path="/integrations" element={<HardwareIntegrations />} />
      <Route path="/enterprise" element={<EnterpriseDashboard />} />
      <Route path="/pro-analytics" element={<DelphiaProAnalytics />} />
      <Route path="/delphia-kids" element={<DelphiaKids />} />
      <Route path="/nutrition-pro" element={<NutritionPro />} />
      <Route path="/sports-academy" element={<SportsAcademy />} />
      <Route path="/ai-coach" element={<AICoach />} />
      <Route path="/team-operations" element={<TeamOperations />} />
      <Route path="/team-communications" element={<TeamCommunications />} />
      <Route path="/team-performance" element={<TeamPerformance />} />
      <Route path="/recruiting-profiles" element={<RecruitingProfiles />} />
      <Route path="/competition-events" element={<CompetitionEvents />} />
      <Route path="/permissions" element={<PermissionsLayer />} />
      <Route path="/organization" element={<OrganizationLayer />} />
      <Route path="/global-competitions" element={<GlobalCompetition />} />
      <Route path="/federations" element={<FederationLayer />} />
      <Route path="/performance-lab" element={<AIPerformanceLab />} />
      <Route path="/medical-rehab" element={<MedicalRehab />} />
      <Route path="/autonomous-coaching" element={<AutonomousCoaching />} />
      <Route path="/government-military" element={<GovernmentMilitary />} />
      <Route path="/about" element={<About />} />

      {/* TACTICAL */}
      <Route path="/tactical/firefighters" element={<Firefighters />} />
      <Route path="/tactical/ems" element={<EMS />} />
      <Route path="/tactical/military" element={<Military />} />
      <Route path="/tactical/police" element={<Police />} />
      
  {/* TACTICAL SPECIALIZED TRAINING */}
  <Route path="/tactical/k9-operations" element={<K9Operations />} />
  <Route path="/tactical/search-rescue" element={<SearchRescue />} />
  <Route path="/tactical/disaster-response" element={<DisasterResponse />} />
  <Route path="/tactical/maritime-operations" element={<MaritimeOperations />} />
  <Route path="/tactical/aviation-crew" element={<AviationCrewReadiness />} />
  <Route path="/tactical/hazmat-cbrn" element={<HazmatCBRN />} />
  <Route path="/tactical/wildland-fire" element={<WildlandFire />} />
  <Route path="/tactical/fitness-civilian" element={<TacticalFitnessCivilian />} />
      
  {/* ACADEMY PREP */}
  <Route path="/tactical/fire-academy" element={<FireAcademyPrep />} />
  <Route path="/tactical/police-academy" element={<PoliceAcademyPrep />} />
  <Route path="/tactical/emt-paramedic" element={<EMTParamedicPrep />} />
  <Route path="/tactical/military-bootcamp" element={<MilitaryBootcampPrep />} />
  <Route path="/tactical/sof-selection" element={<SOFSelectionPrep />} />
  <Route path="/tactical/swat-selection" element={<SWATSelectionPrep />} />
      
  {/* TACTICAL CORE SYSTEMS */}
  <Route path="/tactical/scenario-simulator" element={<ScenarioSimulator />} />
  <Route path="/tactical/loadouts" element={<LoadoutsManager />} />
  <Route path="/tactical/team-ops" element={<TeamOperations />} />
  <Route path="/tactical/instructor" element={<InstructorPortal />} />
  <Route path="/tactical/mission-replay" element={<MissionReplay />} />
  <Route path="/tactical/certifications" element={<CertificationsTracker />} />
  <Route path="/tactical/unit-builder" element={<UnitBuilder />} />

      {/* ADMIN */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/announcements" element={<AdminAnnouncements />} />
      <Route path="/admin/logs" element={<AdminLogs />} />
      <Route path="/admin/messages" element={<AdminMessages />} />
      <Route path="/admin/users" element={<AdminUsers />} />

      {/* UPDATED SETTINGS ROUTE */}
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

function MenuItem({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        color: "white",
        fontSize: "20px",
        fontWeight: "500",
        cursor: "pointer"
      }}
    >
      {label}
    </div>
  );
}

export default App;
