import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Protein from "./pages/Protein.jsx";
import Water from "./pages/Water.jsx";
import Meals from "./pages/Meals.jsx";
import Calories from "./pages/Calories.jsx";
import Profile from "./pages/Profile.jsx";
import History from "./pages/History.jsx";

// NEW SCREENS
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

  return (
    <div style={{ position: "relative" }}>

      {/* GLOBAL DROPDOWN MENU */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            left: "20px",
            backgroundColor: "black",     // ← FIXED: no transparency
            padding: "20px",
            borderRadius: "10px",
            zIndex: 99999,                // ← FIXED: sits above all screens
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minWidth: "200px",
            boxSizing: "border-box"
          }}
        >
          <MenuItem to="/protein" label="Protein" />
          <MenuItem to="/water" label="Water" />
          <MenuItem to="/calories" label="Calories" />
          <MenuItem to="/profile" label="Profile" />
          <MenuItem to="/meals" label="Meals" />
          <MenuItem to="/daily-log" label="Daily Log" />

          {/* NEW MENU ITEMS */}
          <MenuItem to="/supplements" label="Supplements" />
          <MenuItem to="/workouts" label="Workouts" />
          <MenuItem to="/sports" label="Sports" />
          <MenuItem to="/free-training" label="Free Training" />
          <MenuItem to="/goals" label="Goals" />
          <MenuItem to="/progress" label="Progress" />
          <MenuItem to="/journal" label="Journal" />
          <MenuItem to="/community" label="Community" />
          <MenuItem to="/leaderboard" label="Leaderboard" />
          <MenuItem to="/challenges" label="Challenges" />
          <MenuItem to="/achievements" label="Achievements" />
          <MenuItem to="/streaks" label="Streaks" />
          <MenuItem to="/about" label="About" />
          

          {/* ⭐ LOG OUT BUTTON ⭐ */}
          <div
            onClick={() => {
              localStorage.removeItem("loggedIn");
              setMenuOpen(false);
              window.location.href = "/";
            }}
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

      <BrowserRouter>
        <Routes>
          {/* AUTH */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ORIGINAL SCREENS */}
          <Route path="/protein" element={<Protein />} />
          <Route path="/water" element={<Water />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/calories" element={<Calories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
         
          {/* NEW SCREENS */}
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

        </Routes>
      </BrowserRouter>
    </div>
  );
}

function MenuItem({ to, label }) {
  return (
    <a
      href={to}
      style={{
        color: "white",
        fontSize: "20px",
        textDecoration: "none",
        fontWeight: "500"
      }}
    >
      {label}
    </a>
  );
}

export default App;


