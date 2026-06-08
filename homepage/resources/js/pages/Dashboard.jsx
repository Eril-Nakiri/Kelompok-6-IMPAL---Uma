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
                    <h2 className="dashboard-section-title">Berita Terbaru</h2>

                    {featuredNews ? (
                        <div
                            className="dashboard-hero-banner"
                            style={{
                                backgroundImage: `url('${featuredNews.thumbnail_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200"}')`,
                                cursor: 'pointer'
                            }}
                            onClick={() => handleNewsClick(featuredNews.id_news)}
                        >
                            <div className="hero-badge">FEATURED</div>
                            <div className="hero-banner-title">
                                {featuredNews.judul}
                                <div className="hero-meta">
                                    By {featuredNews.publisher} • {new Date(featuredNews.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="dashboard-hero-banner" style={{ background: '#2b2b40', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
                            <p>Belum ada berita utama (featured) yang disetel true.</p>
                        </div>
                    )}

                    <div style={{ marginTop: '10px' }}>
                        <h3 className="dashboard-section-title">LATEST UPDATES</h3>
                        <div className="news-feed-list">
                            {regularNews.length > 0 ? (
                                regularNews.map((news) => (
                                    <div
                                        key={news.id_news}
                                        className="news-item"
                                        onClick={() => handleNewsClick(news.id_news)}
                                    >
                                        <div>
                                            <div className="news-title">{news.judul}</div>
                                            <div className="news-meta">
                                                {news.publisher} • {new Date(news.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                            </div>
                                        </div>
                                        <div className="news-comments">
                                            ➔ Baca
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#94a3b8', fontStyle: 'italic', padding: '10px' }}>Belum ada berita reguler saat ini.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Matches</h3>
                        {upcomingMatches.map((match) => (
                            <div
                                key={match.id}
                                className="match-card"
                                style={{ "--accent-color": match.accent }}
                            >
                                <div className="match-teams">
                                    <span>{match.team1}</span>
                                    <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>-</span>
                                    <span>{match.team2}</span>
                                </div>
                                {match.time && <div className="match-time">{match.time}</div>}
                            </div>
                        ))}
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Live Event</h3>
                        {liveEvents.map((event) => (
                            <div
                                key={event.id}
                                className="live-event-card"
                                style={{ borderLeftColor: event.color }}
                            >
                                <div className="event-name">{event.name}</div>
                                <div className="event-date">{event.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
