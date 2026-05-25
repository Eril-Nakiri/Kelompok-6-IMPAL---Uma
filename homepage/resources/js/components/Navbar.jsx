import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);

    // WAKTU REAL-TIME (Untuk meniru tampilan VLR.gg)
    const [currentTime, setCurrentTime] = useState("");

    // SEARCH STATE
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    // UPDATE WAKTU
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // Format: "10:04 AM Mon"
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dayString = now.toLocaleDateString('en-US', { weekday: 'short' });
            setCurrentTime(`${timeString} ${dayString}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 60000); // Update setiap 1 menit
        return () => clearInterval(timer);
    }, []);

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

                {/* --- BAGIAN KIRI: Logo & Search --- */}
                <div className="nav-left">
                    <Link to="/dashboard" className="logo-vlr">
                        META
                    </Link>

                    {/* SEARCH BOX */}
                    <div className="search-container">
                        <span className="search-icon">🔍</span>
                        <input
                            className="search-input"
                            placeholder="search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        {/* HASIL PENCARIAN DROPDOWN */}
                        {results && results.length > 0 && (
                            <div className="search-results">
                                {results.map((u) => (
                                    <div key={u.id_user} className="search-item">
                                        <span className="search-username">{u.username}</span>
                                        <span className="search-email">{u.email}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- BAGIAN TENGAH: Menu Links (VLR Style) --- */}
                <div className="nav-center">
                    <div className="menu">
                        <Link to="/forum" className="nav-link">forum</Link>
                        <Link to="/matches" className="nav-link">matches</Link>
                        <Link to="/events" className="nav-link">events</Link>
                        <Link to="/stats" className="nav-link">stats</Link>
                        <Link to="/news" className="nav-link">news</Link>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: Waktu & User Profile --- */}
                <div className="nav-right">
                    <div className="nav-time">{currentTime}</div>

                    <div className="nav-divider"></div>

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
                                        <button className="dropdown-item">Settings</button>
                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="login-btn-vlr">
                                👤 Login
                            </Link>
                        )}
                    </div>
                </div>

            </div>
        </nav>
    );
}
