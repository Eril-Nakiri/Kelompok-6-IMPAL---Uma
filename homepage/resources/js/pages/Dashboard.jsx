import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../../css/Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const [backendStatus, setBackendStatus] = useState("Connecting to Laravel API...");
    const [isApiReady, setIsApiReady] = useState(false);

    const [featuredNews, setFeaturedNews] = useState(null);
    const [regularNews, setRegularNews] = useState([]);

    const upcomingMatches = [
        { id: 1, team1: "BLG", team2: "TL", time: "5m", accent: "#a855f7" },
        { id: 2, team1: "PRX", team2: "T1", time: "55m", accent: "#ef4444" },
        { id: 3, team1: "C9", team2: "SEN", time: "1hour 25m", accent: "#3b82f6" },
        { id: 4, team1: "VIT", team2: "NRG", accent: "#a855f7" },
    ];

    const liveEvents = [
        { id: 1, name: "VCT Pacific Stage 1", date: "April 15 - May 12", color: "#ef4444" },
        { id: 2, name: "VCT Americas Stage 1", date: "April 16 - May 13", color: "#3b82f6" },
    ];

    const [matchesList, setMatchesList] = useState([]);
    const [liveList, setLiveList] = useState([]);
    const [upcomingList, setUpcomingList] = useState([]);

    const [teamsMap, setTeamsMap] = useState({});

    const getTournamentBranding = (name) => {
        if (!name) return "#64748b";
        const lower = name.toLowerCase();

        if (lower.includes("master santiago 2026")) return "#a855f7";
        if (lower.includes("vct champions 2026")) return "#eab308";
        if (lower.includes("vct cn stage 1 2026")) return "#ef4444";
        if (lower.includes("vct americas stage 1 2026")) return "#f97316";
        if (lower.includes("vct pacific stage 1 2026")) return "#3b82f6";
        if (lower.includes("vct emea stage 1 2026")) return "#facc15";

        return "#10b981";
    };

    useEffect(() => {
        fetch("/api/dashboard")
            .then((res) => res.json())
            .then((data) => {
                setBackendStatus(data.status || "Connected");
                setIsApiReady(true);
            })
            .catch(() => {
                setBackendStatus("Gagal terhubung ke API");
                setIsApiReady(false);
            });

        fetch("/api/news")
            .then((res) => res.json())
            .then((resData) => {
                if (resData.status === 'success') {
                    setFeaturedNews(resData.data.featured);
                    const filteredRegular = (resData.data.regular || []).filter(
                        (news) => news.id_news !== (resData.data.featured?.id_news || 0)
                    );
                    setRegularNews(filteredRegular);
                }
            })
            .catch((err) => console.error("Gagal mengambil berita:", err));

        fetch("/api/teams")
            .then((res) => res.json())
            .then((resData) => {
                const arr = Array.isArray(resData) ? resData : (resData.data || []);
                const map = {};
                arr.forEach(team => {
                    map[team.id_team] = team.singkatan || team.nama_tim;
                });
                setTeamsMap(map);
            })
            .catch((err) => console.error("Gagal memuat kamus singkatan tim:", err));

        fetch("/api/matches")
            .then((res) => res.json())
            .then((resData) => {
                const arr = Array.isArray(resData) ? resData : (resData.data || []);
                const now = new Date();

                const filtered = arr.filter(m => {
                    return m.jadwal && new Date(m.jadwal) >= now;
                }).sort((a, b) => new Date(a.jadwal) - new Date(b.jadwal));

                setMatchesList(filtered.slice(0, 4));
            })
            .catch((err) => console.error("Gagal memuat matches database:", err));

        fetch("/api/tournament")
            .then((res) => res.json())
            .then((resData) => {
                const arr = Array.isArray(resData) ? resData : (resData.data || []);
                const now = new Date();

                const live = arr.filter(t => {
                    const start = new Date(t.start_date || t.created_at);
                    const end = new Date(t.end_date || now);
                    return start <= now && end >= now;
                });

                const upcoming = arr.filter(t => {
                    return t.start_date && new Date(t.start_date) > now;
                }).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

                setLiveList(live.slice(0, 2));
                setUpcomingList(upcoming.slice(0, 2));
            })
            .catch((err) => console.error("Gagal memuat turnamen database:", err));

    }, []);

    const handleNewsClick = (id) => {
        navigate(`/news/${id}`);
    };

    return (
        <div className="dashboard-page">
            <Navbar />

            <div className={`api-status-banner ${isApiReady ? 'success' : 'error'}`}>
                {backendStatus}
            </div>

            <div className="dashboard-content-wrapper">

                <div className="center-column">
                    <h2 className="main-section-title">Berita Terbaru</h2>

                    {featuredNews ? (
                        <div
                            className="featured-news-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNewsClick(featuredNews.id_news)}
                        >
                            {featuredNews.thumbnail_url && (
                                <div className="featured-thumbnail-container">
                                    <img
                                        src={
                                            featuredNews.thumbnail_url.startsWith('http')
                                                ? featuredNews.thumbnail_url
                                                : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${featuredNews.thumbnail_url}`
                                        }
                                        alt={featuredNews.judul}
                                        className="featured-thumbnail-img"
                                    />
                                </div>
                            )}

                            <div className="featured-news-details">
                                <span className="featured-badge">🔥 BERITA UTAMA</span>
                                <h1 className="featured-news-title">{featuredNews.judul}</h1>
                                <div className="featured-news-meta">
                                    By {featuredNews.publisher || 'Admin'} • {new Date(featuredNews.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-news-info">Tidak ada berita utama saat ini.</div>
                    )}

                    <div className="regular-news-section">
                        <h3 className="sub-section-title">Berita Lainnya</h3>
                        <div className="regular-news-list">
                            {regularNews.length > 0 ? (
                                regularNews.map((news) => (
                                    <div
                                        key={news.id_news}
                                        className="regular-news-item"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleNewsClick(news.id_news)}
                                    >
                                        <span className="news-date">
                                            {new Date(news.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                        <h4 className="regular-news-title">{news.judul}</h4>
                                    </div>
                                ))
                            ) : (
                                <div className="no-news-info">Tidak ada berita reguler saat ini.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sidebar-column">
                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Upcoming Matches</h3>
                        <div className="matches-container">
                            {matchesList.length > 0 ? (
                                matchesList.map((match, idx) => {
                                    const teamA = teamsMap[match.id_team_a] || match.id_team_a || "TBD";
                                    const teamB = teamsMap[match.id_team_b] || match.id_team_b || "TBD";

                                    let displayTime = "";
                                    if (match.jadwal) {
                                        const d = new Date(match.jadwal);
                                        displayTime = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
                                    }

                                    return (
                                        <div
                                            key={match.id_match || idx}
                                            className="match-card"
                                            style={{ "--accent-color": "#ff4654" }}
                                        >
                                            <div className="match-teams">
                                                <span>{teamA}</span>
                                                <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 'bold' }}>-</span>
                                                <span>{teamB}</span>
                                                <small style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>({match.match_format || 'BO3 Series'})</small>
                                            </div>
                                            {displayTime && <div className="match-time">{displayTime}</div>}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-news-info">Tidak ada jadwal tanding terdekat.</p>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Live Event</h3>
                        <div className="events-container">
                            {liveList.length > 0 ? (
                                liveList.map((event, idx) => {
                                    const color = getTournamentBranding(event.nama_turnamen);
                                    const start = new Date(event.start_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
                                    const end = new Date(event.end_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });

                                    return (
                                        <div
                                            key={event.id_tournament || idx}
                                            className="live-event-card"
                                            style={{ borderLeft: `5px solid ${color}` }}
                                        >
                                            {event.logo_url && (
                                                <img
                                                    src={event.logo_url.startsWith('http') ? event.logo_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${event.logo_url}`}
                                                    alt="logo" className="event-logo-img"
                                                />
                                            )}
                                            <div className="event-info-block">
                                                <div className="event-name">{event.nama_turnamen}</div>
                                                <div className="event-date">⏳ {start} - {end}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-news-info">Belum ada event live hari ini.</p>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Upcoming Event</h3>
                        <div className="events-container">
                            {upcomingList.length > 0 ? (
                                upcomingList.map((event, idx) => {
                                    const color = getTournamentBranding(event.nama_turnamen);
                                    const startDateFormatted = new Date(event.start_date).toLocaleDateString('id-ID', {
                                        weekday: 'long', day: 'numeric', month: 'short'
                                    });

                                    return (
                                        <div
                                            key={event.id_tournament || idx}
                                            className="upcoming-event-card"
                                            style={{ borderLeft: `5px solid ${color}` }}
                                        >
                                            {event.logo_url && (
                                                <img
                                                    src={event.logo_url.startsWith('http') ? event.logo_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${event.logo_url}`}
                                                    alt="logo" className="event-logo-img"
                                                />
                                            )}
                                            <div className="event-info-block">
                                                <div className="event-name">{event.nama_turnamen}</div>
                                                <div className="event-date">📅 Mulai: {startDateFormatted}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-news-info">Tidak ada turnamen mendatang.</p>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
