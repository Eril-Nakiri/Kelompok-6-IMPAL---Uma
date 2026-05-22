import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    const [backendStatus, setBackendStatus] = useState("Connecting to Laravel API...");
    const [isApiReady, setIsApiReady] = useState(false);

    // Mock Data Berita (Kiri)
    const newsList = [
        { id: 1, title: 'DRX Calls up academy teams player "yong" to main rosters', comments: 23 },
        { id: 2, title: 'M80 Statement', comments: 12 },
        { id: 3, title: 'Nongshim Red Force make a legendary history', comments: 40 },
        { id: 4, title: 'Paper Rex dominates NRG', comments: 21 },
        { id: 5, title: 'FunPlusPhoenix sign "Sacy" to the squad', comments: 9 },
        { id: 6, title: 'Tenz retirement', comments: 34 },
    ];

    // Mock Data Jadwal Match (Kanan)
    const upcomingMatches = [
        { id: 1, team1: "BLG", team2: "TL", time: "5m", accent: "#a855f7" },
        { id: 2, team1: "PRX", team2: "T1", time: "55m", accent: "#ef4444" },
        { id: 3, team1: "C9", team2: "SEN", time: "1hour 25m", accent: "#3b82f6" },
        { id: 4, team1: "VIT", team2: "NRG", accent: "#a855f7" },
    ];

    // Mock Data Live Events (Kanan Bawah)
    const liveEvents = [
        { id: 1, name: "Masters Santiago", date: "10 Mar - 29 Mar", color: "#8b5cf6" },
        { id: 2, name: "VCL Korea", date: "18 Mar - 27 Mar", color: "#14b8a6" },
    ];

    useEffect(() => {
        fetch("https://kelompok-6-impal-uma-production.up.railway.app")
            .then((res) => res.json())
            .then((result) => {
                setBackendStatus(`Berhasil Terhubung: ${result.app} (v${result.version}) - Status: ${result.status}`);
                setIsApiReady(true);
            })
            .catch((err) => {
                console.error(err);
                setBackendStatus("Gagal menyambungkan ke API Laravel Railway.");
                setIsApiReady(false);
            });
    }, []);

    return (
        <div className="dashboard-page">
            <Navbar />

            {/* BANNER STATUS API BACKEND */}
            <div className={`api-status-banner ${isApiReady ? "success" : "error"}`}>
                📡 {backendStatus}
            </div>

            <div className="dashboard-content-wrapper">

                {/* KOLOM KIRI (BERITA & BANNER UTAMA) */}
                <div className="dashboard-main-col">
                    {/* Banner Hero */}
                    <div className="dashboard-hero-banner">
                        <div className="hero-banner-title">
                            Carlotta Sign With FNATIC
                        </div>
                    </div>

                    {/* Feed Berita Terbaru */}
                    <div className="news-feed-list">
                        {newsList.map((news) => (
                            <div key={news.id} className="news-item">
                                <span className="news-title">{news.title}</span>
                                <span className="news-comments">{news.comments}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KOLOM KANAN (JADWAL MATCH & EVENT) */}
                <div className="dashboard-sidebar-col">

                    {/* Upcoming Matches */}
                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Upcoming Match</h3>
                        {upcomingMatches.map((match) => (
                            <div
                                key={match.id}
                                className="match-card"
                                style={{"--accent-color": match.accent}}
                            >
                                <div className="match-teams">
                                    <span>{match.team1}</span>
                                    <span style={{color: "#cbd5e1", fontSize: "0.85rem"}}>-</span>
                                    <span>{match.team2}</span>
                                </div>
                                {match.time && <div className="match-time">{match.time}</div>}
                            </div>
                        ))}
                    </div>

                    {/* Live Events */}
                    <div className="sidebar-widget">
                        <h3 className="sidebar-section-title">Live Event</h3>
                        {liveEvents.map((event) => (
                            <div
                                key={event.id}
                                className="live-event-card"
                                style={{borderLeftColor: event.color}}
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
