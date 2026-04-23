import { useState } from "react";
import Navbar from "../components/Navbar";
import AuthCard from "../components/AuthCard";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log("REGISTER:", username, email, password);
  };

  return (
    <div>
      <Navbar />
      <AuthCard title="Register">

        <input
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>SIGN UP</button>

      </AuthCard>
    </div>
  );
}