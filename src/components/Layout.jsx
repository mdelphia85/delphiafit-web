import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Login.css";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Protein from "./pages/Protein.jsx";
import Water from "./pages/Water.jsx";
import Meals from "./pages/Meals.jsx";
import Calories from "./pages/Calories.jsx";
import Profile from "./pages/Profile.jsx";
import History from "./pages/History.jsx";

import Layout from "./components/Layout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login/Register (no nav bar) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App screens (with bottom nav) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/protein" element={<Protein />} />
          <Route path="/water" element={<Water />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/calories" element={<Calories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
