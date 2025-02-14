import React from "react";
import Home from "./pages/Home";
import AuthProvider from "./context/AuthProvider";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Game from "./components/game/Game";
import Leaderboard from "./components/leaderboard/Leaderboard";
import { useAuth } from "./context/AuthContext";
import AdminDashbourd from "./components/dashbourd/AdminDashbourd";
import Login from "./components/login/Login";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashbourd />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

