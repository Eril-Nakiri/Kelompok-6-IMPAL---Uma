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

    // SEARCH API (DEBUG VERSION)
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

                {/* --- BAGIAN KIRI: Logo & Menu --- */}
                <div className="nav-left">
                    <Link to="/dashboard" className="logo">
                        META
                    </Link>
                    <div className="menu">
                        <Link to="/dashboard" className="nav-link">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/stats" className="nav-link">Stats</Link>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: Search & User Profile --- */}
                <div className="nav-right">

                    {/* SEARCH */}
                    <div className="search-container">
                        <input
                            className="search-input"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        {/* HASIL PENCARIAN DROPDOWN */}
                        {results && results.length > 0 && (
                            <div className="search-results">
                                {results.map((u) => (
                                    <div key={u.id_user} className="search-item">
                                        {u.username} - {u.email}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* USER DROPDOWN */}
                    <div className="user-section">
                        {user ? (
                            <div className="user-dropdown">
                                <div
                                    className="user-trigger"
                                    onClick={() => setOpen(!open)}
                                >
                                    👤 <span className="username-text">{user.username}</span>
                                </div>

                                {open && (
                                    <div className="dropdown-menu">
                                        <button className="dropdown-item">Ganti Username</button>
                                        <button className="dropdown-item">Ganti Password</button>
                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="user-box login-btn">
                                👤 Login
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}
