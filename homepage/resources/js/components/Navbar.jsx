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
                    <div style={{ position: "relative", width: "250px" }}>
                    <input
                        className="search"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {results && results.length > 0 && (
                        <div style={{
                            position: "absolute",
                            top: "45px",
                            left: 0,
                            width: "100%",
                            background: "white",
                            border: "1px solid black",
                            zIndex: 99999,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                        }}>
                            {results.map((u) => (
                                <div
                                    key={u.id_user}
                                    style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: "white",
                                        color: "black"
                                    }}
                                >
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
                                    👤 {user.username}
                                </div>

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
