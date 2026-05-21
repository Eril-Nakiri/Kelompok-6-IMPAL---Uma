import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "";

    const handleRegister = async () => {
        try {
            const res = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Register berhasil");

                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);

                window.location.href = "/dashboard";
            } else {
                alert(data.message || "Register gagal");
            }
        } catch (error) {
            console.error(error);
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

                    {/* Sisi Kiri: Form Register (Glassmorphism) */}
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
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                className="login-input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Tautan kembali ke halaman login */}
                        <div className="login-actions-register">
                            <Link to="/login" className="btn-link">
                                Already have an account? Sign In
                            </Link>
                        </div>

                        <div className="button-wrapper">
                            <button className="btn-login" onClick={handleRegister}>
                                SIGN UP
                            </button>
                        </div>
                    </div>

                    {/* Sisi Kanan: Gambar Banner Esports Unsplash */}
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
