import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import '../../css/Dashboard.css';

export default function Dashboard() {
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
                    setRegularNews(resData.data.regular || []);
                }
            })
            .catch((err) => console.error("Gagal mengambil berita:", err));
    }, []);

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
                        <div className="featured-news-card">
                            {featuredNews.thumbnail && (
                                <img
                                    src={featuredNews.thumbnail}
                                    alt={featuredNews.judul}
                                    className="featured-thumbnail"
                                />
                            )}
                            <div className="featured-content">
                                <span className="news-date">
                                    {new Date(featuredNews.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <h3 className="featured-title">{featuredNews.judul}</h3>
                                <p className="featured-snippet">{featuredNews.isi_berita}</p>
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
                                    <div key={news.id} className="regular-news-item">
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
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Live Event</h3>
                        <div className="events-container">
                            {liveEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="live-event-card"
                                    style={{ borderLeft: `4px solid ${event.color}` }}
                                >
                                    <div className="event-name">{event.name}</div>
                                    <div className="event-date">{event.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
