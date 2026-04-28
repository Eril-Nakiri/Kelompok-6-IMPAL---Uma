import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        syncUser();
    }, []);

    const syncUser = () => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
        setUser(JSON.parse(storedUser));
        } else {
        setUser(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);

        navigate("/login");
    };

    return (
        <div className="navbar">

        {/* LOGO */}
        <Link to="/dashboard" className="logo">
            META
        </Link>

        <div className="nav-right">

            {/* MENU */}
            <div className="menu">
            <Link to="/dashboard">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/stats">Stats</Link>
            </div>

            {/* SEARCH */}
            <input className="search" placeholder="Search..." />

            {/* USER SECTION */}
            <div className="user-section">

            {user ? (
                <div className="user-box" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span>👤 {user.username}</span>

                <button onClick={handleLogout} style={{ cursor: "pointer" }}>
                    Logout
                </button>
                </div>
            ) : (
                <Link to="/login" className="user-box">
                <span>👤 Login</span>
                </Link>
            )}

            </div>

        </div>
        </div>
    );
}
