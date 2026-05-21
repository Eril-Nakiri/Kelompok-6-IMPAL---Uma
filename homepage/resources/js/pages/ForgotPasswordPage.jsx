import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [generatedCaptcha, setGeneratedCaptcha] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "";

    // Algoritma Pembuat Kode Captcha Alfanumerik Acak (5 Karakter)
    const generateNewCaptcha = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; // Menghilangkan karakter mirip seperti O, 0, I, l
        let result = "";
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGeneratedCaptcha(result);
        setCaptchaInput(""); // Reset inputan user setelah captcha diubah
    };

    // Generate captcha otomatis saat pertama kali halaman dimuat
    useEffect(() => {
        generateNewCaptcha();
    }, []);

    const handleResetProcess = async () => {
        // 1. Validasi Input Kosong Sisi Client
        if (!username || !email || !captchaInput) {
            alert("Harap isi semua kolom input termasuk kode verifikasi Captcha!");
            return;
        }

        // 2. ALGORITMA VERIFIKASI CAPTCHA (Bukan Bot)
        // Kita bandingkan secara Case-Sensitive (sensitif huruf besar/kecil)
        if (captchaInput !== generatedCaptcha) {
            alert("Verifikasi Gagal! Kode Captcha yang Anda masukkan salah.");
            generateNewCaptcha(); // Segarkan captcha baru jika salah demi keamanan
            return;
        }

        try {
            // 3. VALIDASI DATABASE (Kombinasi Username + Email)
            const res = await fetch(`${API_URL}/api/forgot-password-verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert(`Sukses: ${data.message}\n(Lanjutkan ke logika sistem pengubahan password Anda)`);
                // Di sini Anda bisa mengarahkan user ke halaman ganti password baru jika diperlukan, contoh:
                // window.location.href = `/reset-password-form?id=${data.user_id}`;
            } else {
                alert(data.message || "Data tidak cocok.");
                generateNewCaptcha(); // Segarkan captcha setiap kali ada kegagalan request
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan pada server / jaringan gagal.");
            generateNewCaptcha();
        }
    };

    return (
        <div className="login-page-container">
            <Navbar />

            <div className="page-wrapper">
                <div className="split-login-card">

                    {/* Sisi Kiri: Form Forgot Password dengan Captcha (Glassmorphism) */}
                    <div className="login-form-side">
                        <h1 className="brand-title">META.PORTAL</h1>

                        <div className="input-group">
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

                            {/* Section Captcha Anti-Bot */}
                            <label style={{ color: "#cbd5e1", fontSize: "0.85rem", marginTop: "10px" }}>
                                Security Verification (Case-Sensitive):
                            </label>
                            <div className="captcha-container">
                                <div className="captcha-box">{generatedCaptcha}</div>
                                <button
                                    type="button"
                                    className="btn-refresh-captcha"
                                    onClick={generateNewCaptcha}
                                    title="Ganti Kode Baru"
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
                        </div>

                        <div className="login-actions-register">
                            <Link to="/login" className="btn-link">
                                Remember your password? Sign In
                            </Link>
                        </div>

                        <div className="button-wrapper">
                            <button className="btn-login" onClick={handleResetProcess}>
                                VERIFY ACCOUNT
                            </button>
                        </div>
                    </div>

                    {/* Sisi Kanan: Cyber Esports Banner Gambar Unsplash */}
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
