import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import Landing from "./pages/Landing.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DailyLog from "./pages/DailyLog.jsx";

// ADMIN SCREENS
import AdminLogin from "./admin/Login.jsx";
import AdminDashboard from "./admin/Dashboard.jsx";
import AdminAnalytics from "./admin/Analytics.jsx";
import AdminAnnouncements from "./admin/Announcements.jsx";
import AdminLogs from "./admin/Logs.jsx";
import AdminMessages from "./admin/Messages.jsx";
import AdminUsers from "./Admin/Users.jsx";


import { MenuProvider, MenuContext } from "./context/MenuContext.jsx";

function App() {
  return (
    <MenuProvider>
      <BrowserRouter>
        <AppWithMenu />
      </BrowserRouter>
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

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <div style={{ position: "relative" }}>

      {/* ⭐ GLOBAL MENU OVERLAY */}
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
            boxSizing: "border-box",
            border: "2px solid white"
          }}
        >
          <MenuItem label="Protein" onClick={() => go("/protein")} />
          <MenuItem label="Water" onClick={() => go("/water")} />
          <MenuItem label="Calories" onClick={() => go("/calories")} />
          <MenuItem label="Profile" onClick={() => go("/profile")} />
          <MenuItem label="Meals" onClick={() => go("/meals")} />
          <MenuItem label="Daily Log" onClick={() => go("/daily-log")} />

          {/* NEW SCREENS */}
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

          {/* ⭐ LOG OUT */}
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

      {/* ⭐ ROUTES */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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

        {/* ⭐ ADMIN ROUTES */}
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
        textDecoration: "none",
        fontWeight: "500",
        cursor: "pointer"
      }}
    >
      {label}
    </div>
  );
}

export default App;
