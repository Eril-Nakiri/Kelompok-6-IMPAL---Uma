import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // State baru untuk mengatur visibilitas password (true = kelihatan, false = disembunyikan)
    const [showPassword, setShowPassword] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "";

    const handleRegister = async () => {
        // --- ALGORITMA VALIDASI CLIENT-SIDE ---
        if (!username || !email || !password) {
            alert("Semua kolom input wajib diisi!");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        if (!passwordRegex.test(password)) {
            alert(
                "Password tidak memenuhi syarat!\n" +
                "- Minimal 8 karakter\n" +
                "- Setidaknya mengandung 1 angka\n" +
                "- Setidaknya mengandung 1 huruf kapital\n" +
                "- Setidaknya mengandung 1 simbol (misal: !, @, #, $, %, etc.)"
            );
            return;
        }

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
            <Navbar />
            <div className="page-wrapper">
                <div className="split-login-card">

                    {/* Sisi Kiri: Form Register */}
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

                            {/* Wadah khusus dengan tombol mata */}
                            <div className="password-input-container">
                                <input
                                    className="login-input"
                                    // Tipe input berubah dinamis tergantung state showPassword
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password (Min. 8 char, 1 Capital, 1 Number, 1 Symbol)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <div className="button-wrapper">
                            <button className="btn-login" onClick={handleRegister}>
                                SIGN UP
                            </button>
                        </div>
                    </div>

                    {/* Sisi Kanan: Banner */}
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
