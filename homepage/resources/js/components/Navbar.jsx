import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);

    // SEARCH STATE
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    // LOAD USER
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // SEARCH API
    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.length >= 2) {
                fetch(`http://127.0.0.1:8000/api/users/search?query=${query}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && Array.isArray(data.data)) {
                            setResults(data.data);
                        } else {
                            setResults([]);
                        }
                    })
                    .catch(err => {
                        console.error("FETCH ERROR:", err);
                        setResults([]);
                    });
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* --- SISI KIRI: Logo, Search, Menu --- */}
                <div className="nav-left">
                    <Link to="/dashboard" className="logo">
                        META
                    </Link>

                    {/* SEARCH BOX */}
                    <div className="search-container">
                        <input
                            className="search-input"
                            placeholder="Search...."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {/* SEARCH DROPDOWN */}
                        {results && results.length > 0 && (
                            <div className="search-dropdown">
                                {results.map((u) => (
                                    <div key={u.id_user} className="search-item">
                                        <div className="search-username">{u.username}</div>
                                        <div className="email">{u.email}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* MENU LINKS */}
                    <div className="menu">
                        <Link to="/dashboard" className="nav-link">Forum</Link>
                        <Link to="/matches" className="nav-link">Matches</Link>
                        <Link to="/stats" className="nav-link">Stats</Link>
                    </div>
                </div>

                {/* --- SISI KANAN: Icons & User Profile --- */}
                <div className="nav-right">

                    {/* USER PROFILE & DROPDOWN */}
                    <div className="user-section">
                        {user ? (
                            <div className="user-dropdown">
                                <button className="icon-btn" onClick={() => setOpen(!open)} title={user.username}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </button>

                                {open && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            Hi, {user.name ? user.name : user.username}
                                        </div>
                                        <button className="dropdown-item">Ganti Username</button>
                                        <button className="dropdown-item">Ganti Password</button>
                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="login-btn-nav">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* MAIL ICON */}
                    <button className="icon-btn">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </button>

                    {/* HAMBURGER MENU ICON */}
                    <button className="icon-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                </div>
            </div>
        </nav>
    );
}
