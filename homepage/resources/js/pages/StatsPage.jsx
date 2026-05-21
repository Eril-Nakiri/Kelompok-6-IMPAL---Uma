import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import "../../css/Stat.css";

export default function StatsPage() {
    // Daftar Agent langsung ditaruh sebagai nilai default state agar dropdown TIDAK MUNGKIN KOSONG
    const [agents, setAgents] = useState([
        "Astra", "Breach", "Brimstone", "Chamber", "Clove", "Cypher",
        "Deadlock", "Fade", "Gekko", "Harbor", "Iso", "Jett", "KAY/O",
        "Killjoy", "Neon", "Omen", "Phoenix", "Raze", "Reyna", "Sage",
        "Skye", "Sova", "Tejo", "Viper", "Yoru"
    ]);

    const [maps, setMaps] = useState([
        "Ascent", "Bind", "Breeze", "Abyss", "Fracture",
        "Haven", "Icebox", "Lotus", "Pearl", "Split", "Sunset"
    ]);

    // Mengembalikan seluruh state filter bawaan awal seperti semula
    const [filters, setFilters] = useState({
        eventSeries: "All",
        region: "All",
        minRounds: "",
        minRating: "",
        agent: "All",
        map: "All",
        timespan: "Past 60 Days"
    });

    const [stats, setStats] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Fungsi fetch data statistik dari database
    const fetchStatsData = (currentFilters) => {
        const params = new URLSearchParams();

        // Hanya kirim parameter jika nilainya bukan 'All' dan tidak kosong
        if (currentFilters.agent && currentFilters.agent !== 'All') params.append('agent', currentFilters.agent);
        if (currentFilters.map && currentFilters.map !== 'All') params.append('map', currentFilters.map);
        if (currentFilters.minRounds) params.append('minRounds', currentFilters.minRounds);
        if (currentFilters.minRating) params.append('minRating', currentFilters.minRating);

        fetch(`${API_URL}/api/stats?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                console.log("Response Database Stats:", data);
                // Memastikan data array masuk dengan benar baik berupa data.data maupun langsung array
                setStats(data.data || data || []);
            })
            .catch(err => console.error("Error fetching stats:", err));
    };

    // Dieksekusi OTOMATIS saat pertama kali masuk ke halaman Stats
    useEffect(() => {
        // 1. Ambil data leaderboard awal tanpa filter (menampilkan semua data dari DB)
        fetchStatsData(filters);

        // 2. Opsional: Sync filter dari backend jika ada map/agent baru di database Anda
        fetch(`${API_URL}/api/stats/filters`)
            .then(res => res.json())
            .then(data => {
                if (data.agents && data.agents.length > 0) setAgents(data.agents);
                if (data.maps && data.maps.length > 0) setMaps(data.maps);
            })
            .catch(err => console.error("Error fetching filters:", err));
    }, []);

    const handleApply = () => {
        fetchStatsData(filters);
    };

    return (
        <>
            <Navbar />
            <div className="stats-page-container">
                <div className="stats-content-wrapper">
                    <h2 className="stats-page-title">PLAYER STATISTICS LEADERBOARD</h2>

                    {/* FILTER TOOLBAR LENGKAP */}
                    <div className="filter-toolbar">
                        <div className="filter-item">
                            <label>Event Series</label>
                            <select name="eventSeries" value={filters.eventSeries} onChange={handleChange}>
                                <option value="All">All</option>
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Region</label>
                            <select name="region" value={filters.region} onChange={handleChange}>
                                <option value="All">All</option>
                            </select>
                        </div>

                        <div className="filter-item short-input">
                            <label>MIN # RNDS</label>
                            <input
                                name="minRounds"
                                type="number"
                                placeholder="0"
                                value={filters.minRounds}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="filter-item short-input">
                            <label>MIN OOP RATING</label>
                            <input
                                name="minRating"
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                value={filters.minRating}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="filter-item">
                            <label>AGENT</label>
                            <select name="agent" value={filters.agent} onChange={handleChange}>
                                <option value="All">All</option>
                                {agents.map((agent, index) => (
                                    <option key={index} value={agent}>
                                        {agent}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>MAP</label>
                            <select name="map" value={filters.map} onChange={handleChange}>
                                <option value="All">All</option>
                                {maps.map((map, index) => (
                                    <option key={index} value={map}>
                                        {map}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>TIMESPAN</label>
                            <select name="timespan" value={filters.timespan} onChange={handleChange}>
                                <option value="Past 60 Days">Past 60 Days</option>
                            </select>
                        </div>

                        <button className="btn-apply-filters" onClick={handleApply}>
                            Apply
                        </button>
                    </div>

                    {/* TABLE SECTION */}
                    <div className="stats-table-card">
                        <table className="vlr-style-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", paddingLeft: "20px" }}>User</th>
                                    <th>Agent</th>
                                    <th>Kills</th>
                                    <th>Deaths</th>
                                    <th>Assists</th>
                                    <th>KD</th>
                                    <th>ACS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.length > 0 ? (
                                    stats.map((row, index) => (
                                        <tr key={index} className="vlr-table-row">
                                            <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                                                <span className="rank-number">{index + 1}.</span>
                                                <span className="player-name">User {row.id_user}</span>
                                            </td>
                                            <td>
                                                <span className="agent-badge">{row.agent_used || "No Agent"}</span>
                                            </td>
                                            <td className="stat-number">{row.kills}</td>
                                            <td className="stat-number text-muted">{row.deaths}</td>
                                            <td className="stat-number text-muted">{row.assists}</td>
                                            <td className="stat-number kd-highlight">{row.kd || (row.deaths > 0 ? (row.kills/row.deaths).toFixed(2) : row.kills)}</td>
                                            <td className="stat-number acs-glow">{row.acs || 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="no-data-cell">
                                            📡 Menghubungkan ke database... Pastikan data pada tabel 'player_match_stats' tersedia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}
