import { useState } from "react";
import Navbar from "../components/Navbar";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("LOGIN:", username, password);
  };

  return (
    <div>
      <Navbar />
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
            Sign up
          </Link>
        </div>

        <button className="btn-login" onClick={handleLogin}>
          LOGIN
        </button>

      </AuthCard>
    </div>
  );
}