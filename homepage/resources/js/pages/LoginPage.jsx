import { useState } from "react";
import Navbar from "../components/Navbar";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";

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
        <>
            <Navbar />

            <div className="page-wrapper">
                <AuthCard title="META.portal">
                    <input
                        className="login-input"
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className="login-input"
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="login-actions">
                        <Link to="/forgot-password" className="btn-small">
                            Forgot Password
                        </Link>

                        <Link to="/register" className="btn-small">
                            Sign Up
                        </Link>
                    </div>

                    <button className="btn-login" onClick={handleLogin}>
                        LOGIN
                    </button>
                </AuthCard>
            </div>
        </>
    );
}
