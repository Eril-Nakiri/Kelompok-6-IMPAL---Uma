import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 1. Tambahkan useNavigate
import Navbar from "../components/Navbar";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Opsional: Tambahkan loading state
    const navigate = useNavigate(); // Inisialisasi

    const API_URL = import.meta.env.VITE_API_URL || "";

    // 2. Ubah handleLogin untuk menerima event
    const handleLogin = async (e) => {
        e.preventDefault(); // Mencegah reload halaman secara default

        if (!username || !password) {
            alert("Username dan Password wajib diisi!");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard"); // Navigasi mulus tanpa reload
            } else {
                alert(data.message || "Login gagal");
            }
        } catch (err) {
            console.error(err);
            alert("Server error / koneksi gagal");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <Navbar />
            <div className="page-wrapper">
                <div className="split-login-card">
                    <div className="login-form-side">
                        <h1 className="brand-title">META.PORTAL</h1>

                        {/* 3. Bungkus dengan form */}
                        <form onSubmit={handleLogin} className="input-group">
                            <input
                                className="login-input"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <div className="password-input-container">
                                <input
                                    className="login-input"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            <div className="login-actions">
                                <Link to="/forgot-password" className="btn-link">Forgot Password?</Link>
                                <Link to="/register" className="btn-link">Sign Up</Link>
                            </div>

                            <div className="button-wrapper">
                                {/* Gunakan type="submit" */}
                                <button type="submit" className="btn-login" disabled={isLoading}>
                                    {isLoading ? "LOADING..." : "LOGIN"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="login-image-side">
                        <img
                            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
                            alt="Banner"
                            className="banner-img"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
