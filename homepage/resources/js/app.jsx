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
import NewsPage from "./pages/NewsPage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import PlayerPage from "./pages/PlayerPage.jsx";

import DashboardAdmin from "./pages/DashboardAdmin.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route path="/home" element={<Home />} />

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

            <Route
                path="/news"
                element={
                <ProtectedRoute>
                    <NewsPage />
                </ProtectedRoute>
                }
            />

            <Route
                path="/forum"
                element={
                <ProtectedRoute>
                    <ForumPage />
                </ProtectedRoute>
                }
            />

            <Route
                path="/teams"
                element={
                    <ProtectedRoute>
                        <TeamPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/players"
                element={
                    <ProtectedRoute>
                        <PlayerPage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<LoginPage />} />

            <Route
                path="/dashboard-admin"
                element={
                    <ProtectedRoute allowedRoles={[1]}>
                        <DashboardAdmin />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
