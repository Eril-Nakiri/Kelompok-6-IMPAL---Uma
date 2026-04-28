import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);

    // ambil user saat pertama render
    useEffect(() => {
        syncUser();
    }, []);

    // fungsi untuk ambil user dari localStorage
    const syncUser = () => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
        setUser(JSON.parse(storedUser));
        } else {
        setUser(null);
        }
    };

    // biar navbar auto update kalau localStorage berubah
    useEffect(() => {
        const handleStorageChange = () => {
        syncUser();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
        window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

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
                <div className="user-box">
                <span className="user-icon">👤</span>
                <span>{user.username}</span>
                </div>
            ) : (
                <Link to="/login" className="user-box">
                <span className="user-icon">👤</span>
                <span>Login</span>
                </Link>
            )}
            </div>

        </div>
        </div>
    );
}
