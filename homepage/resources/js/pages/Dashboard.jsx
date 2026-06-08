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

    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [liveEvents, setLiveEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const getTournamentColor = (name) => {
        if (!name) return "#64748b";
        const lowerName = name.toLowerCase();

        if (lowerName.includes("masters")) return "#a855f7";
        if (lowerName.includes("champions")) return "#eab308";
        if (lowerName.includes("china")) return "#ef4444";
        if (lowerName.includes("america")) return "#f97316";
        if (lowerName.includes("pacific")) return "#3b82f6";
        if (lowerName.includes("emea")) return "#facc15";

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

        fetch("/api/matches")
            .then((res) => res.json())
            .then((resData) => {
                const arr = Array.isArray(resData) ? resData : (resData.data || []);
                const now = new Date();

                const filterUpcoming = arr.filter(match => {
                    const matchSchedule = match.jadwal;
                    if (!matchSchedule) return false;
                    return new Date(matchSchedule) >= now;
                }).sort((a, b) => {
                    return new Date(a.jadwal) - new Date(b.jadwal);
                });

                setUpcomingMatches(filterUpcoming.slice(0, 4));
            })
            .catch((err) => console.error("Gagal memuat matches:", err));

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
                    const start = new Date(t.start_date);
                    return start > now;
                }).sort((a, b) => {
                    return new Date(a.start_date) - new Date(b.start_date);
                });

                setLiveEvents(live.slice(0, 2));
                setUpcomingEvents(upcoming.slice(0, 2));
            })
            .catch((err) => console.error("Gagal memuat tournament:", err));
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
                            {upcomingMatches.length > 0 ? (
                                upcomingMatches.map((match, idx) => {
                                    const teamA = match.id_team_a || "TEAM A";
                                    const teamB = match.id_team_b || "TEAM B";
                                    const matchSchedule = match.jadwal;

                                    const accentColor = "#ff4654";

                                    let displayTime = "";
                                    if (matchSchedule) {
                                        const d = new Date(matchSchedule);
                                        displayTime = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
                                    }

                                    return (
                                        <div
                                            key={match.id_match || idx}
                                            className="match-card"
                                            style={{ "--accent-color": accentColor }}
                                        >
                                            <div className="match-teams">
                                                <span>{teamA}</span>
                                                <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>-</span>
                                                <span>{teamB}</span>
                                                <small style={{ fontSize: '10px', color: '#64748b' }}>({match.match_format || 'BO3'})</small>
                                            </div>
                                            {displayTime && <div className="match-time">{displayTime}</div>}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-news-info" style={{ padding: '4px' }}>Tidak ada jadwal tanding terdekat.</p>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Live Event</h3>
                        <div className="events-container">
                            {liveEvents.length > 0 ? (
                                liveEvents.map((event, idx) => {
                                    const color = getTournamentColor(event.nama_turnamen);
                                    const start = new Date(event.start_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
                                    const end = new Date(event.end_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });

                                    return (
                                        <div
                                            key={event.id_tournament || idx}
                                            className="live-event-card"
                                            style={{ borderLeft: `5px solid ${color}` }} // Penerapan warna Poin 3
                                        >
                                            <div className="event-name">{event.nama_turnamen}</div>
                                            <div className="event-date">⏳ {start} - {end}</div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-news-info" style={{ padding: '4px' }}>Belum ada event live hari ini.</p>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Upcoming Event</h3>
                        <div className="events-container">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event, idx) => {
                                    const color = getTournamentColor(event.nama_turnamen);
                                    const startDateFormatted = new Date(event.start_date).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'short'
                                    });

                                    return (
                                        <div
                                            key={event.id_tournament || idx}
                                            className="upcoming-event-card"
                                            style={{ borderLeft: `5px solid ${color}` }}
                                        >
                                            <div className="event-name">{event.nama_turnamen}</div>
                                            <div className="event-date">📅 Mulai: {startDateFormatted}</div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-news-info" style={{ padding: '4px' }}>Tidak ada turnamen mendatang.</p>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
