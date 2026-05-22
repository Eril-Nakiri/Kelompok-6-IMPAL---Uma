import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import "../../css/Stat.css";

export default function StatsPage() {
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

    const fetchStatsData = (currentFilters) => {
        const params = new URLSearchParams();

        if (currentFilters.agent && currentFilters.agent !== 'All') params.append('agent', currentFilters.agent);
        if (currentFilters.map && currentFilters.map !== 'All') params.append('map', currentFilters.map);
        if (currentFilters.minRounds) params.append('minRounds', currentFilters.minRounds);
        if (currentFilters.minRating) params.append('minRating', currentFilters.minRating);

        fetch(`${API_URL}/api/stats?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                console.log("Response Database Stats:", data);
                setStats(data.data || data || []);
            })
            .catch(err => console.error("Error fetching stats:", err));
    };

    useEffect(() => {
        fetchStatsData(filters);

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

    // Fungsi penentu warna background rating ala VLR
    const getRatingColor = (rating) => {
        if (!rating) return "bg-tier-default";
        if (rating >= 1.30) return "bg-tier-s";
        if (rating >= 1.05) return "bg-tier-a";
        return "bg-tier-b";
    };

    return (
        <>
            <Navbar />
            <div className="stats-page-container">
                <div className="stats-layout-grid">

                    {/* SISI KIRI: MAIN CONTENT */}
                    <div className="stats-main-content">

                        {/* FILTER CARD */}
                        <div className="meta-card filter-card">
                            <div className="filter-row top-row">
                                <div className="filter-item">
                                    <label>Event Series</label>
                                    <select name="eventSeries" value={filters.eventSeries} onChange={handleChange}>
                                        <option value="All">All</option>
                                    </select>
                                </div>
                            </div>

                            <div className="filter-row bottom-row">
                                <div className="filter-item">
                                    <label>Region</label>
                                    <select name="region" value={filters.region} onChange={handleChange}>
                                        <option value="All">All</option>
                                    </select>
                                </div>

                                <div className="filter-item short">
                                    <label>Min # Rnds</label>
                                    <input name="minRounds" type="number" placeholder="0" value={filters.minRounds} onChange={handleChange} />
                                </div>

                                <div className="filter-item short">
                                    <label>Min OOP Rating</label>
                                    <input name="minRating" type="number" step="0.1" placeholder="0.0" value={filters.minRating} onChange={handleChange} />
                                </div>

                                <div className="filter-item">
                                    <label>Agent</label>
                                    <select name="agent" value={filters.agent} onChange={handleChange}>
                                        <option value="All">All</option>
                                        {agents.map((agent, index) => (
                                            <option key={index} value={agent}>{agent}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-item">
                                    <label>Map</label>
                                    <select name="map" value={filters.map} onChange={handleChange}>
                                        <option value="All">All</option>
                                        {maps.map((map, index) => (
                                            <option key={index} value={map}>{map}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-item">
                                    <label>Timespan</label>
                                    <select name="timespan" value={filters.timespan} onChange={handleChange}>
                                        <option value="Past 60 Days">Past 60 Days</option>
                                    </select>
                                </div>
                            </div>

                            <button className="btn-apply-red" onClick={handleApply}>Apply</button>
                        </div>

                        {/* DATA TABLE CARD */}
                        <div className="meta-card table-card">
                            <table className="stats-data-table">
                                <thead>
                                    <tr>
                                        <th className="text-left">Player</th>
                                        <th>RND</th>
                                        <th>Rtg</th>
                                        <th>ACS</th>
                                        <th>KAST</th>
                                        <th>ADR</th>
                                        <th>K</th>
                                        <th>D</th>
                                        <th>A</th>
                                        <th>FK</th>
                                        <th>FD</th>
                                        <th>HS%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.length > 0 ? (
                                        stats.map((row, index) => (
                                            <tr key={index}>
                                                <td className="player-cell">
                                                    <div className="player-info">
                                                        <span className="player-name">{row.nama || `User ${row.id_player}`}</span>
                                                        <span className="team-name">{row.nama_tim || "FA"}</span>
                                                    </div>
                                                    <span className="agent-text">{row.agent_used}</span>
                                                </td>
                                                <td>{row.rounds || 0}</td>
                                                <td className={`stat-box ${getRatingColor(row.rating)}`}>
                                                    {row.rating || "0.00"}
                                                </td>
                                                <td className="stat-box bg-tier-default">{row.acs || 0}</td>
                                                <td className="stat-box bg-tier-default">{row.kast || 0}%</td>
                                                <td className="stat-box bg-tier-default">{row.adr || 0}</td>
                                                <td>{row.kills || 0}</td>
                                                <td>{row.deaths || 0}</td>
                                                <td>{row.assists || 0}</td>
                                                <td>{row.first_kills || 0}</td>
                                                <td>{row.first_deaths || 0}</td>
                                                <td>{row.hs_percentage || 0}%</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="12" className="no-data">
                                                📡 Sedang menarik data dari database...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SISI KANAN: SIDEBAR LEGEND */}
                    <div className="stats-sidebar">
                        <div className="meta-card legend-card">
                            <div className="legend-item">
                                <div className="color-box purple"></div>
                                <div className="legend-text">
                                    <span className="tier">Tier S</span>
                                    <span className="desc">Top 1-5% (Rating &gt; 1.30)</span>
                                </div>
                            </div>
                            <div className="legend-item">
                                <div className="color-box green"></div>
                                <div className="legend-text">
                                    <span className="tier">Tier A</span>
                                    <span className="desc">Good (Rating 1.05 - 1.29)</span>
                                </div>
                            </div>
                            <div className="legend-item">
                                <div className="color-box yellow"></div>
                                <div className="legend-text">
                                    <span className="tier">Tier B</span>
                                    <span className="desc">Average (Rating &lt; 1.05)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
