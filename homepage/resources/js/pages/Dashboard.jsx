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

                const upcoming = arr.filter(match => {
                    const matchTime = match.time || match.match_time || match.waktu || match.tanggal || match.date;
                    if (!matchTime) return true;
                    return new Date(matchTime) >= now;
                }).sort((a, b) => {
                    const tA = new Date(a.time || a.match_time || a.waktu || a.tanggal || a.date);
                    const tB = new Date(b.time || b.match_time || b.waktu || b.tanggal || b.date);
                    return tA - tB;
                });

                setUpcomingMatches(upcoming.length > 0 ? upcoming.slice(0, 4) : arr.slice(0, 4));
            })
            .catch((err) => console.error("Gagal memuat matches:", err));

        fetch("/api/tournament")
            .then((res) => res.json())
            .then((resData) => {
                const arr = Array.isArray(resData) ? resData : (resData.data || []);
                setLiveEvents(arr.slice(0, 3));
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
                            onClick={() => handleNewsClick(featuredNews.id_news || featuredNews.id)}
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
                                    By {featuredNews.publisher || 'Admin'} • {new Date(featuredNews.tanggal_post || featuredNews.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                                        key={news.id_news || news.id}
                                        className="regular-news-item"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleNewsClick(news.id_news || news.id)}
                                    >
                                        <span className="news-date">
                                            {new Date(news.tanggal_post || news.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
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
                                    const teamA = match.team1 || match.team_a || match.team_1_name || match.tim1 || "TBD";
                                    const teamB = match.team2 || match.team_b || match.team_2_name || match.tim2 || "TBD";
                                    const matchTimeRaw = match.time || match.match_time || match.waktu || match.tanggal || match.date;

                                    const accent = match.accent || match.color || ["#a855f7", "#ef4444", "#3b82f6", "#10b981", "#f59e0b"][idx % 5];

                                    let displayTime = "";
                                    if (matchTimeRaw) {
                                        const d = new Date(matchTimeRaw);
                                        displayTime = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                                        if (displayTime === 'Invalid Date') displayTime = matchTimeRaw;
                                    }

                                    return (
                                        <div
                                            key={match.id_match || match.id || idx}
                                            className="match-card"
                                            style={{ "--accent-color": accent }}
                                        >
                                            <div className="match-teams">
                                                <span>{teamA}</span>
                                                <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>-</span>
                                                <span>{teamB}</span>
                                            </div>
                                            {displayTime && <div className="match-time">{displayTime}</div>}
                                        </div>
                                    );
                                })
                            ) : (
                                <p style={{color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', padding: '10px'}}>Belum ada pertandingan terdekat...</p>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Live Event</h3>
                        <div className="events-container">
                            {liveEvents.length > 0 ? (
                                liveEvents.map((event, idx) => {
                                    const eventName = event.name || event.nama_turnamen || event.judul || event.tournament_name || "Turnamen TBD";
                                    const eventDateRaw = event.date || event.tanggal || event.start_date || event.waktu;
                                    const eventColor = event.color || event.accent || ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"][idx % 4];

                                    let displayDate = "";
                                    if (eventDateRaw) {
                                        const d = new Date(eventDateRaw);
                                        displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                        if (displayDate === 'Invalid Date') displayDate = eventDateRaw;
                                    }

                                    return (
                                        <div
                                            key={event.id_tournament || event.id || idx}
                                            className="live-event-card"
                                            style={{ borderLeft: `4px solid ${eventColor}` }}
                                        >
                                            <div className="event-name">{eventName}</div>
                                            {displayDate && <div className="event-date">{displayDate}</div>}
                                        </div>
                                    );
                                })
                            ) : (
                                <p style={{color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', padding: '10px'}}>Belum ada event live...</p>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
