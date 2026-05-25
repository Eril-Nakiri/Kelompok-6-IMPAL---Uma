import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);

    // WAKTU REAL-TIME (Untuk meniru tampilan VLR.gg)
    const [currentTime, setCurrentTime] = useState("");

    // SEARCH STATE
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    // Referensi untuk mendeteksi klik di luar area dropdown pencarian
    const searchRef = useRef(null);

    const navigate = useNavigate();

    // Gunakan string kosong karena React dan Laravel berada di 1 server (Monolith Railway)
    const API_URL = import.meta.env.VITE_API_URL || "";

    // UPDATE WAKTU
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
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

    // SEARCH API (VERSI PRODUCTION)
    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.trim().length >= 2) {
                // Menembak API global search yang baru dibuat di Laravel
                fetch(`${API_URL}/api/search?q=${query}`)
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            setResults(data);
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

    // Menutup dropdown search jika user klik di luar kotak pencarian
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setResults([]); // Sembunyikan hasil
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Aksi ketika hasil pencarian diklik
    const handleResultClick = (item) => {
        setQuery(""); // Kosongkan input pencarian
        setResults([]); // Tutup dropdown

        // Arahkan ke halaman spesifik sesuai tipe (Team atau Player)
        if (item.type === 'player') {
            navigate(`/player/${item.id}`);
        } else if (item.type === 'team') {
            navigate(`/team/${item.id}`);
        }
    };

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
                    <div className="search-container" ref={searchRef}>
                        <span className="search-icon">🔍</span>
                        <input
                            className="search-input"
                            placeholder="search teams or players..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        {/* HASIL PENCARIAN DROPDOWN */}
                        {results && results.length > 0 && (
                            <div className="search-results-dropdown">
                                {results.map((item, index) => (
                                    <div
                                        key={index}
                                        className="search-item-row"
                                        onClick={() => handleResultClick(item)}
                                    >
                                        {/* FOTO/LOGO */}
                                        <div className="search-item-img">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} />
                                            ) : (
                                                <div className="img-fallback"></div>
                                            )}
                                        </div>

                                        {/* NAMA & TIPE (Player/Team) */}
                                        <div className="search-item-info">
                                            <span className="search-item-name">{item.name}</span>
                                            <span className="search-item-type">
                                                {item.type === 'player' ? 'Player' : 'Team'}
                                            </span>
                                        </div>
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
