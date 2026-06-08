import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import "../css/app.css";
import "../css/index.css";

import Dashboard from "./pages/Dashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import MatchesPage from "./pages/MatchesPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import PlayerPage from "./pages/PlayerPage.jsx";
import ForumDashboard from './pages/ForumDashboard.jsx';
import CreateThread from './pages/CreateThread.jsx';
import ThreadDetail from './pages/ThreadDetail.jsx';
import MatchDetail from "./pages/MatchDetail.jsx";

import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import InputMatchResult from "./pages/InputMatchResult.jsx";
import InputMatch from "./pages/InputMatch.jsx";
import ManageNews from "./pages/ManageNews.jsx";
import AddNews from "./pages/AddNews.jsx";
import EditNews from "./pages/EditNews.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
    return (
            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                <Route
                    path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />

                <Route
                    path="/stats" element={
                        <ProtectedRoute><StatsPage /></ProtectedRoute>
                    } />

                <Route
                    path="/news" element={
                        <ProtectedRoute><NewsPage /></ProtectedRoute>
                    } />

                <Route
                    path="/news/:id" element={
                        <ProtectedRoute><NewsPage /></ProtectedRoute>
                    } />

                <Route
                    path="/matches" element={
                        <ProtectedRoute><MatchesPage /></ProtectedRoute>
                    } />

                <Route
                    path="/team/:id" element={
                        <ProtectedRoute><TeamPage /></ProtectedRoute>
                    } />

                <Route
                    path="/player/:id" element={
                        <ProtectedRoute><PlayerPage /></ProtectedRoute>
                    } />

                <Route
                    path="/dashboard-admin" element={
                        <ProtectedRoute allowedRoles={[1]}> <DashboardAdmin />
                        </ProtectedRoute>
                    } />

                <Route
                    path="/input-match-result" element={
                        <ProtectedRoute allowedRoles={[1]}> <InputMatchResult />
                        </ProtectedRoute>
                    } />

                <Route
                    path="/input-match" element={
                        <ProtectedRoute allowedRoles={[1]}> <InputMatch />
                        </ProtectedRoute>
                    } />

                <Route
                    path="/forum" element={
                        <ProtectedRoute><ForumDashboard />
                        </ProtectedRoute>}
                    />

                <Route
                    path="/forum/create" element={
                        <ProtectedRoute><CreateThread />
                        </ProtectedRoute>}
                    />

                <Route
                    path="/forum/thread/:id" element={
                        <ProtectedRoute><ThreadDetail />
                        </ProtectedRoute>}
                    />

                <Route
                    path="/admin/news" element={
                        <ProtectedRoute allowedRoles={[1]}><ManageNews /></ProtectedRoute>
                    } />

                <Route
                    path="/admin/news/add" element={
                        <ProtectedRoute allowedRoles={[1]}><AddNews /></ProtectedRoute>
                    } />

                <Route
                    path="/matches/:id" element={
                        <ProtectedRoute><MatchDetail /></ProtectedRoute>
                    } />

                <Route
                    path="/admin/news/edit/:id" element={
                        <ProtectedRoute allowedRoles={[1]}><EditNews /></ProtectedRoute>
                    } />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
    );
}
export default App;
