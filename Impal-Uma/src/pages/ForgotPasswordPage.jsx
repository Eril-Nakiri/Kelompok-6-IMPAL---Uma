import { useState } from "react";
import Navbar from "../components/Navbar";
import AuthCard from "../components/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    console.log("RESET PASSWORD:", email);
  };

  return (
    <div>
      <Navbar />
      <AuthCard title="Forgot Password">

        <input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleReset}>SEND RESET LINK</button>

      </AuthCard>
    </div>
  );
}