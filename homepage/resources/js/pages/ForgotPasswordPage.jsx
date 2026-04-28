import { useState } from "react";
import Navbar from "../components/Navbar";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleReset = () => {
        console.log("RESET PASSWORD:", email);
    };

    return (
        <>
        <Navbar />

        <div className="page-wrapper">

            <AuthCard title="Forgot Password">

            <input
                className="login-input"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn-login" onClick={handleReset}>
                SEND RESET LINK
            </button>

            </AuthCard>

        </div>
        </>
    );
}
