import AuthCard from "../components/AuthCard";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

// Baris import CSS lokal dipindahkan ke App.css global agar tidak memicu error build di Vite
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "";

    const handleLogin = async () => {
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/dashboard";
            } else {
                alert(data.message || "Login gagal");
            }
        } catch (err) {
            console.error(err);
            alert("Server error / koneksi gagal");
        }
    };

    return (
        <div className="login-page-container">
            {/* Navbar tetap di paling atas */}
            <Navbar />

            {/* Wrapper Utama untuk Konten Tengah */}
            <div className="page-wrapper">

                {/* Main Card Wrapper (Split Layout) */}
                <div className="split-login-card">

                    {/* Sisi Kiri: Form Login (Glassmorphism) */}
                    <div className="login-form-side">
                        <h1 className="brand-title">META.PORTAL</h1>

                        <div className="input-group">
                            <input
                                className="login-input"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <input
                                className="login-input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="login-actions">
                            <Link to="/forgot-password" className="btn-link">
                                Forgot Password?
                            </Link>
                            <Link to="/register" className="btn-link">
                                Sign Up
                            </Link>
                        </div>

                        <div className="button-wrapper">
                            <button className="btn-login" onClick={handleLogin}>
                                LOGIN
                            </button>
                        </div>
                    </div>

                    {/* Sisi Kanan: Gambar Banner */}
                    <div className="login-image-side">
                        <img
                            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
                            alt="META Portal Esports Banner"
                            className="banner-img"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
