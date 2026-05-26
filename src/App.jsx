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
import About from "./pages/About.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DailyLog from "./pages/DailyLog.jsx";

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

// TACTICAL REAL APP
import Firefighters from "./pages/Firefighters.jsx";
import EMS from "./pages/EMS.jsx";
import Military from "./pages/Military.jsx";
import Police from "./pages/Police.jsx";

import { MenuProvider, MenuContext } from "./context/MenuContext.jsx";

function App() {
  return (
    <MenuProvider>
      <AppWithMenu />
    </MenuProvider>
  );
}

function AppWithMenu() {
  const { menuOpen, setMenuOpen } = useContext(MenuContext);
  const navigate = useNavigate();

  function go(path) {
    navigate(path);
    setMenuOpen(false);
  }

  // ⭐ FIXED LOGOUT
  function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <div style={{ position: "relative" }}>
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            left: "20px",
            backgroundColor: "black",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minWidth: "200px",
            border: "2px solid white"
          }}
        >
          <MenuItem label="Protein" onClick={() => go("/protein")} />
          <MenuItem label="Water" onClick={() => go("/water")} />
          <MenuItem label="Calories" onClick={() => go("/calories")} />
          <MenuItem label="Profile" onClick={() => go("/profile")} />
          <MenuItem label="Meals" onClick={() => go("/meals")} />
          <MenuItem label="Daily Log" onClick={() => go("/daily-log")} />

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
          <MenuItem label="About" onClick={() => go("/about")} />

          <MenuItem label="Firefighters" onClick={() => go("/tactical/firefighters")} />
          <MenuItem label="EMS" onClick={() => go("/tactical/ems")} />
          <MenuItem label="Military" onClick={() => go("/tactical/military")} />
          <MenuItem label="Police" onClick={() => go("/tactical/police")} />

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
      )}

      <Routes>
        {/* DEMO MODE */}
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
        <Route path="/about" element={<About />} />
        <Route path="/daily-log" element={<DailyLog />} />

        {/* TACTICAL */}
        <Route path="/tactical/firefighters" element={<Firefighters />} />
        <Route path="/tactical/ems" element={<EMS />} />
        <Route path="/tactical/military" element={<Military />} />
        <Route path="/tactical/police" element={<Police />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </div>
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

