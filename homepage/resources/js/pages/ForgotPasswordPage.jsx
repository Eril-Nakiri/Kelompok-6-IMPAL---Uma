import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleReset = () => {
        console.log("RESET PASSWORD:", email);
        // Tambahkan logika integrasi API reset password Anda di sini jika diperlukan
    };

    return (
        <div className="login-page-container">
            {/* Navbar tetap di paling atas */}
            <Navbar />

            {/* Wrapper Utama untuk Konten Tengah */}
            <div className="page-wrapper">

                {/* Main Card Wrapper (Split Layout) */}
                <div className="split-login-card">

                    {/* Sisi Kiri: Form Forgot Password (Glassmorphism) */}
                    <div className="login-form-side">
                        <h1 className="brand-title">META.PORTAL</h1>

                        <div className="input-group">
                            <input
                                className="login-input"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Navigasi kembali ke Login */}
                        <div className="login-actions-register">
                            <Link to="/login" className="btn-link">
                                Remember your password? Sign In
                            </Link>
                        </div>

                        <div className="button-wrapper">
                            <button className="btn-login" onClick={handleReset}>
                                SEND RESET LINK
                            </button>
                        </div>
                    </div>

                    {/* Sisi Kanan: Gambar Banner Esports Unsplash (Sama seperti Login/Register) */}
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
