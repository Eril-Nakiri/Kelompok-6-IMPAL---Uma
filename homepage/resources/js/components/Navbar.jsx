import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="navbar">

        <div className="navbar-inner">

            {/* LOGO */}
            <Link to="/dashboard" className="logo">
            META
            </Link>

            {/* RIGHT SIDE */}
            <div className="nav-right">

            {/* MENU */}
            <div className="menu">
                <Link to="/dashboard">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/stats">Stats</Link>
            </div>

            {/* SEARCH */}
            <input className="search" placeholder="Search..." />

            {/* USER DROPDOWN */}
            <div className="user-section">

                {user ? (
                <div className="user-dropdown">

                    {/* TRIGGER */}
                    <div
                    className="user-trigger"
                    onClick={() => setOpen(!open)}
                    >
                    👤 {user.username}
                    </div>

                    {/* DROPDOWN */}
                    {open && (
                    <div className="dropdown-menu">

                        <button className="dropdown-item">
                        Ganti Username
                        </button>

                        <button className="dropdown-item">
                        Ganti Password
                        </button>

                        <button
                        className="dropdown-item logout"
                        onClick={handleLogout}
                        >
                        Logout
                        </button>

                    </div>
                    )}

                </div>
                ) : (
                <Link to="/login" className="user-box">
                    👤 Login
                </Link>
                )}

            </div>

            </div>

        </div>

        </div>
    );
}
