import { useState } from "react";
import Navbar from "../components/Navbar";
import AuthCard from "../components/AuthCard";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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
        alert("Server error");
        }
    };

    return (
        <>
        <Navbar />

        <div className="page-wrapper">

            <AuthCard title="Register">

            <input
                className="login-input"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                className="login-input"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="login-input"
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn-login" onClick={handleRegister}>
                SIGN UP
            </button>

            </AuthCard>

        </div>
        </>
    );
}
