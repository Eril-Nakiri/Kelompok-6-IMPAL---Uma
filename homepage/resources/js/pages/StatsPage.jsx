import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import "../../css/Stat.css";

export default function StatsPage() {
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
    const [agents, setAgents] = useState([]);
    const [maps, setMaps] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Fungsi fetch data dengan membawa seluruh parameter filter saat ini
    const fetchStatsData = (currentFilters) => {
        const params = new URLSearchParams(currentFilters).toString();

        fetch(`${API_URL}/api/stats?${params}`)
            .then(res => res.json())
            .then(data => {
                console.log("DATABASE STATS RESPONSE:", data);
                // Menyiasati struktur data response dari Laravel
                setStats(data.data || data || []);
            })
            .catch(err => console.error("Error fetching stats:", err));
    };

    // Dieksekusi otomatis ketika user pertama kali mendarat di halaman Stats
    useEffect(() => {
        // 1. Ambil isian dropdown Agent & Map dari Backend Laravel
        fetch(`${API_URL}/api/stats/filters`)
            .then(res => res.json())
            .then(data => {
                setAgents(data.agents || []);
                setMaps(data.maps || []);
            })
            .catch(err => console.error("Error fetching filters:", err));

        // 2. Langsung panggil data awal tanpa menunggu user klik tombol
        fetchStatsData(filters);
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

                    {/* FILTER TOOLBAR LENGKAP YANG SUDAH KEMBALI BAGUS */}
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
                                                <span className="agent-badge">{row.agent_used}</span>
                                            </td>
                                            <td className="stat-number">{row.kills}</td>
                                            <td className="stat-number text-muted">{row.deaths}</td>
                                            <td className="stat-number text-muted">{row.assists}</td>
                                            <td className="stat-number kd-highlight">{row.kd}</td>
                                            <td className="stat-number acs-glow">{row.acs}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="no-data-cell">
                                            📡 Menghubungkan ke database... Pastikan table 'player_match_stats' terisi data.
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
