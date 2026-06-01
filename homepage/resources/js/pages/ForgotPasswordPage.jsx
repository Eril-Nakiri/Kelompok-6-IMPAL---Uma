import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [generatedCaptcha, setGeneratedCaptcha] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "";

    // Algoritma Generator Captcha
    const generateNewCaptcha = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        let result = "";
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGeneratedCaptcha(result);
        setCaptchaInput("");
    };

    useEffect(() => {
        generateNewCaptcha();
    }, []);

    const handleVerifyAccount = async () => {
        if (!username || !email || !captchaInput) {
            alert("Harap isi semua kolom input termasuk kode Captcha!");
            return;
        }

        if (captchaInput !== generatedCaptcha) {
            alert("Verifikasi Gagal! Kode Captcha salah.");
            generateNewCaptcha();
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/forgot-password-verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ username, email }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Akun Terverifikasi! Silakan buat password baru Anda.");
                setUserId(data.user_id);
                setStep(2);
            } else {
                alert(data.message || "Data akun tidak cocok.");
                generateNewCaptcha();
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan pada server.");
            generateNewCaptcha();
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            alert("Kedua kolom password wajib diisi!");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Konfirmasi password tidak cocok! Pastikan keduanya sama.");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert(
                "Password baru tidak memenuhi kriteria keamanan!\n" +
                "- Minimal 8 karakter\n" +
                "- Setidaknya mengandung 1 angka\n" +
                "- Setidaknya mengandung 1 huruf kapital\n" +
                "- Setidaknya mengandung 1 simbol (!, @, #, $, dll.)"
            );
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/forgot-password-update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    password: newPassword
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert(data.message);
                window.location.href = "/login";
            } else {
                alert(data.message || "Gagal memperbarui password.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan sistem saat memperbarui password.");
        }
    };

    return (
        <div className="login-page-container">
            <Navbar />

            <div className="page-wrapper">
                <div className="split-login-card">

                    <div className="login-form-side">
                        <h1 className="brand-title">META.PORTAL</h1>

                        {step === 1 ? (
                            <div className="input-group">
                                <p style={{ color: "#00E1D9", fontSize: "0.95rem", marginBottom: "15px" }}>
                                    Step 1: Account & Security Verification
                                </p>

                                <input
                                    className="login-input"
                                    type="text"
                                    placeholder="Enter your Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <input
                                    className="login-input"
                                    type="email"
                                    placeholder="Enter your Registered Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <label style={{ color: "#cbd5e1", fontSize: "0.85rem", marginTop: "10px" }}>
                                    Security Verification (Case-Sensitive):
                                </label>
                                <div className="captcha-container">
                                    <div className="captcha-box">{generatedCaptcha}</div>
                                    <button
                                        type="button"
                                        className="btn-refresh-captcha"
                                        onClick={generateNewCaptcha}
                                    >
                                        🔄
                                    </button>
                                </div>

                                <input
                                    className="login-input"
                                    type="text"
                                    placeholder="Type the captcha code above"
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    style={{ marginTop: "5px" }}
                                />

                                <div className="button-wrapper" style={{ marginTop: "20px" }}>
                                    <button className="btn-login" onClick={handleVerifyAccount}>
                                        VERIFY ACCOUNT
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="input-group">
                                <p style={{ color: "#00E1D9", fontSize: "0.95rem", marginBottom: "15px" }}>
                                    Step 2: Create Your New Secure Password
                                </p>

                                <div className="password-input-container">
                                    <input
                                        className="login-input"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="New Password (Min. 8 char, Capital, Num, Symbol)"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>

                                <div className="password-input-container" style={{ marginTop: "10px" }}>
                                    <input
                                        className="login-input"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <div className="button-wrapper" style={{ marginTop: "25px" }}>
                                    <button className="btn-login" onClick={handleUpdatePassword}>
                                        RESET PASSWORD
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="login-actions-register">
                            <Link to="/login" className="btn-link">
                                Back to Sign In
                            </Link>
                        </div>
                    </div>

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
