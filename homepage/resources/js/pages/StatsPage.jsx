import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import "../../css/Stat.css";

export default function StatsPage() {
    // 1. Initial filter state (Agent defaults to "All")
    const [filters, setFilters] = useState({
        agent: "All",
        minKills: ""
    });

    const [stats, setStats] = useState([]);
    const [agents, setAgents] = useState([]); // Untuk menampung list agent dari backend

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    // Fungsi utama untuk mengambil data statistik dari backend
    const fetchStatsData = (currentFilters) => {
        // Menggunakan currentFilters langsung agar tidak terjebak masalah async state closure
        const params = new URLSearchParams();

        if (currentFilters.agent && currentFilters.agent !== 'All') {
            params.append('agent', currentFilters.agent);
        }
        if (currentFilters.minKills) {
            params.append('minKills', currentFilters.minKills);
        }

        fetch(`${API_URL}/api/stats?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                // Sesuaikan dengan response format backend Anda ('data' atau langsung array)
                setStats(data.data || data || []);
            })
            .catch(err => console.error("Error fetching stats:", err));
    };

    // useEffect dijalankan SEKALI saat pertama kali halaman dibuka
    useEffect(() => {
        // A. Ambil daftar agent untuk dropdown dari backend getFilters()
        fetch(`${API_URL}/api/stats/filters`)
            .then(res => res.json())
            .then(data => {
                setAgents(data.agents || []);
            })
            .catch(err => console.error("Error fetching filters:", err));

        // B. LANGSUNG panggil data statistik pertama kali dengan filter bawaan awal (All)
        fetchStatsData(filters);
    }, []); // Array kosong berarti hanya jalan 1x pas halaman loading awal

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Fungsi saat tombol "APPLY FILTER" diklik oleh user
    const handleApply = () => {
        fetchStatsData(filters);
    };

    return (
        <>
            <Navbar />
            <div className="stats-page-container">
                <div className="stats-content-wrapper">
                    <h2 className="stats-page-title">PLAYER STATISTICS LEADERBOARD</h2>

                    <div className="filter-toolbar">
                        {/* Dropdown Agent */}
                        <div className="filter-item">
                            <label>Agent</label>
                            <select name="agent" value={filters.agent} onChange={handleChange}>
                                <option value="All">All Agents</option>
                                {agents.map((agent, index) => (
                                    <option key={index} value={agent}>
                                        {agent}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Input Min Kills */}
                        <div className="filter-item">
                            <label>Min Kills</label>
                            <input
                                name="minKills"
                                type="number"
                                placeholder="0"
                                value={filters.minKills}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="btn-apply-filters" onClick={handleApply}>
                            APPLY FILTER
                        </button>
                    </div>

                    {/* Bagian Table Data tetap seperti kode Anda sebelumnya */}
                    <div className="stats-table-card">
                        <table className="vlr-style-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Agent</th>
                                    <th>Kills</th>
                                    <th>Deaths</th>
                                    <th>Assists</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.length > 0 ? (
                                    stats.map((row, index) => (
                                        <tr key={index} className="vlr-table-row">
                                            <td>User {row.id_user}</td>
                                            <td>{row.agent_used}</td>
                                            <td>{row.kills}</td>
                                            <td>{row.deaths}</td>
                                            <td>{row.assists}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-data-cell">
                                            📡 Data tidak ditemukan atau database kosong.
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
