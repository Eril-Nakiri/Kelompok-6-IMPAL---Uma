import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import '../../css/Dashboard.css';

export default function Dashboard() {
    const [backendStatus, setBackendStatus] = useState("Connecting to Laravel API...");
    const [isApiReady, setIsApiReady] = useState(false);

    const [featuredNews, setFeaturedNews] = useState(null);
    const [newsList, setNewsList] = useState([]);

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
                setBackendStatus(`${data.app} v${data.version} - Status: ${data.status}`);
                setIsApiReady(true);
            })
            .catch((err) => {
                setBackendStatus("Gagal terhubung ke Laravel Backend ❌");
                console.error(err);
            });

        const fetchNews = async () => {
            try {
                const res = await fetch("/api/news/dashboard");
                const result = await res.json();
                if (result.status === "success") {
                    setFeaturedNews(result.data.featured);
                    setNewsList(result.data.regular || []);
                }
            } catch (error) {
                console.error("Gagal memuat berita:", error);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="dashboard-container">
            <Navbar />

            <div className={`api-status-banner ${isApiReady ? "ready" : "loading"}`}>
                <span className="status-dot"></span>
                <p className="status-text">{backendStatus}</p>
            </div>

            <div className="main-layout">
                <div className="center-column">

                    {featuredNews ? (
                        <div className="main-news-card">
                            <div className="main-news-image-wrapper">
                                <img
                                    src={featuredNews.thumbnail_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600"}
                                    alt={featuredNews.judul}
                                    className="main-news-image"
                                />
                                <div className="main-news-badge">FEATURED</div>
                            </div>
                            <div className="main-news-content">
                                <h1 className="main-news-title">{featuredNews.judul}</h1>
                                <p className="main-news-meta">
                                    By {featuredNews.publisher} • {new Date(featuredNews.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="main-news-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                            <p>Belum ada berita utama (featured) yang disetel true.</p>
                        </div>
                    )}

                    <div className="news-list-container">
                        <h2 className="section-title">Latest Updates</h2>
                        {newsList.length > 0 ? (
                            newsList.map((news) => (
                                <div key={news.id_news} className="news-row-item">
                                    <div className="news-row-left">
                                        <h3 className="news-row-title">{news.judul}</h3>
                                        <p className="news-row-meta">
                                            {news.publisher} • {new Date(news.tanggal).toLocaleDateString('id-ID', { dateStyle: 'short' })}
                                        </p>
                                    </div>
                                    <div className="news-row-right">
                                        <span className="comment-bubble">💬 12</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#94a3b8', fontStyle: 'italic', padding: '10px' }}>Belum ada berita terbaru.</p>
                        )}
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
