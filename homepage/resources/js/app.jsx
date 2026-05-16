import { Routes, Route } from "react-router-dom";

import "../css/app.css";
import "../css/index.css";

import Home from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";

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
