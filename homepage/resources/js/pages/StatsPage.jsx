import Navbar from "../components/Navbar";
import { useState, useEffect, useMemo } from "react";
import "../../css/Stat.css";

export default function StatsPage() {
    // 1. STATE & KONSTANTA (Struktur Paling Atas Agar Aman dari Build Error)
    const [stats, setStats] = useState([]);
    const API_URL = "";

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
        event: "All", // GANTI DARI eventSeries MENJADI event 🔥
        region: "All",
        minRounds: "",
        minRating: "",
        agent: "All",
        map: "All"
    });

    const [regions, setRegions] = useState([]);
    const [events, setEvents] = useState([]);

    // 2. FUNGSI FETCH DATA STATISTIK (Diberikan pengaman pembacaan array data)
    const fetchStatsData = (currentFilters) => {
        const params = new URLSearchParams();

        if (currentFilters.agent && currentFilters.agent !== 'All') params.append('agent', currentFilters.agent);
        if (currentFilters.map && currentFilters.map !== 'All') params.append('map', currentFilters.map);
        if (currentFilters.region && currentFilters.region !== 'All') params.append('region', currentFilters.region);
        if (currentFilters.event && currentFilters.event !== 'All') params.append('event', currentFilters.event);
        if (currentFilters.minRounds) params.append('minRounds', currentFilters.minRounds);
        if (currentFilters.minRating) params.append('minRating', currentFilters.minRating);

        fetch(`${API_URL}/api/stats?${params.toString()}`)
            .then(res => res.json())
            .then(resData => {
                console.log("Response Database Stats:", resData);
                // PASTIKAN MEMBACA .data KARENA LARAVEL MENGEMBALIKAN ['data' => $data]
                if (resData && resData.data) {
                    setStats(resData.data);
                } else if (Array.isArray(resData)) {
                    setStats(resData);
                } else {
                    setStats([]);
                }
            })
            .catch(err => {
                console.error("Error fetching stats:", err);
                setStats([]);
            });
    };

    // 3. HANDLER PERUBAHAN FILTER
    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // 4. LIFECYCLE EFFECT (MEMANGGIL DATA PERTAMA KALI)
    useEffect(() => {
        fetchStatsData(filters);

        fetch(`${API_URL}/api/stats/filters`)
            .then(res => res.json())
            .then(data => {
                if (data.agents && data.agents.length > 0) setAgents(data.agents);
                if (data.maps && data.maps.length > 0) setMaps(data.maps);
                if (data.countries && data.countries.length > 0) setRegions(data.countries);
                if (data.tournaments && data.tournaments.length > 0) setEvents(data.tournaments);
            })
            .catch(err => console.error("Error fetching filters:", err));
    }, []);

    const handleApply = () => {
        fetchStatsData(filters);
    };

    const getRatingColor = (rating) => {
        if (!rating) return "bg-tier-default";
        if (rating >= 1.30) return "bg-tier-s";
        if (rating >= 1.05) return "bg-tier-a";
        return "bg-tier-b";
    };

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

    const handleSort = (key) => {
        let direction = 'desc'; // Default klik pertama akan mengurutkan dari Terbesar (desc)
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';  // Klik kedua diubah menjadi Terkecil (asc)
        } else if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'default'; // Klik ketiga mengembalikan ke urutan normal
            key = null;
        }
        setSortConfig({ key, direction });
    };

    const sortedStats = useMemo(() => {
        let sortableItems = [...stats];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Cek apakah datanya berupa angka valid atau teks
                const isNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue);

                if (isNumeric) {
                    // Jika angka, jadikan desimal/float
                    aValue = parseFloat(aValue) || 0;
                    bValue = parseFloat(bValue) || 0;
                } else {
                    // Jika teks (seperti nama map), jadikan huruf kecil semua agar sorting akurat
                    aValue = String(aValue || '').toLowerCase();
                    bValue = String(bValue || '').toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [stats, sortConfig]);

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽';
        }
        return '';
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
                                    <label>Event</label>
                                    <select name="event" value={filters.event} onChange={handleChange}>
                                        <option value="All">All Events</option>
                                        {events.map((namaTurnamen, index) => (
                                            <option key={index} value={namaTurnamen}>{namaTurnamen}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="filter-row bottom-row">
                                <div className="filter-item">
                                    <label>Region / Country</label>
                                    <select name="region" value={filters.region} onChange={handleChange}>
                                        <option value="All">All Regions</option>
                                        {regions.map((country, index) => (
                                            <option key={index} value={country}>{country}</option>
                                        ))}
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

                            </div>

                            <button className="btn-apply-red" onClick={handleApply}>Apply</button>
                        </div>

                        {/* DATA TABLE CARD */}
                        <div className="meta-card table-card">
                            <table className="stats-data-table">
                                <thead>
                                    <tr>
                                        <th className="text-left">Player</th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('map_name')}>
                                            Map{getSortIcon('map_name')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('rounds')}>
                                            RND{getSortIcon('rounds')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('rating')}>
                                            Rtg{getSortIcon('rating')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('acs')}>
                                            ACS{getSortIcon('acs')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('kast')}>
                                            KAST{getSortIcon('kast')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('adr')}>
                                            ADR{getSortIcon('adr')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('kills')}>
                                            K{getSortIcon('kills')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('deaths')}>
                                            D{getSortIcon('deaths')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('assists')}>
                                            A{getSortIcon('assists')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('first_kills')}>
                                            FK{getSortIcon('first_kills')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('first_deaths')}>
                                            FD{getSortIcon('first_deaths')}
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort('hs_percentage')}>
                                            HS%{getSortIcon('hs_percentage')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedStats.length > 0 ? (
                                        sortedStats.map((row, index) => (
                                            <tr key={index}>
                                                <td className="player-cell" style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                                                    <img
                                                        src={row.photo_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                                        alt={row.nama || "Player"}
                                                        className="player-avatar"
                                                    />

                                                    <div className="player-info">
                                                        <span className="player-name">{row.nama || `User ${row.id_player}`}</span>
                                                        <span className="team-name">{row.nama_tim || "FA"}</span>
                                                    </div>
                                                    <span className="agent-text">{row.agent_used}</span>
                                                </td>

                                                <td className="stat-box bg-tier-default">{row.map_name || '-'}</td>

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
                                                ⚠️ Tidak ada data statistik ditemukan atau gagal terhubung ke server.
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
