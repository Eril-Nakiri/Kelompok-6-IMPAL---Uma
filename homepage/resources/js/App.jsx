import { Routes, Route } from "react-router-dom";

import "../css/App.css";
import "../css/index.css";

import Home from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AboutPage from "./pages/AboutPage";
import StatsPage from "./pages/StatsPage";

import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
    return (
        <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
            path="/dashboard"
            element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
            }
        />

        <Route
            path="/about"
            element={
            <ProtectedRoute>
                <AboutPage />
            </ProtectedRoute>
            }
        />

        <Route
            path="/stats"
            element={
            <ProtectedRoute>
                <StatsPage />
            </ProtectedRoute>
            }
        />

        <Route path="*" element={<Home />} />

        </Routes>
    );
}

export default App;
