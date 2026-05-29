import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../../css/MatchesPage.css';

export default function MatchesPage() {
    const [matches, setMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [loading, setLoading] = useState(true);

    const API_URL = "https://kelompok6uma-impal.up.railway.app";

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/matches`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setMatches(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Gagal mengambil data:", error);
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const filteredMatches = matches.filter(match => {
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);

        const matchDate = new Date(match.jadwal);

        if (activeTab === 'upcoming') {
            return matchDate >= now && matchDate <= oneMonthLater && (match.skor_akhir_a === null || match.skor_akhir_a === undefined);
        } else {
            return matchDate < now ||
                (match.skor_akhir_a !== null && match.skor_akhir_a !== undefined);
        }
    });

    // Grouping berdasarkan id_tournament
    const groupedMatches = filteredMatches.reduce((acc, match) => {
        const id_tournament = match.id_tournament || 'unknown';
        if (!acc[id_tournament]) {
            acc[id_tournament] = {
                id_tournament,
                nama_turnamen: match.nama_turnamen || "Turnamen Tanpa Nama",
                penyelenggara: match.penyelenggara || "Penyelenggara",
                matches: []
            };
        }
        acc[id_tournament].matches.push(match);
        return acc;
    }, {});

    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        if (isNaN(date.getTime())) return "-";
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="matches-page-container">
            <Navbar />

            <div className="matches-content">
                <div className="matches-header">
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                        onClick={() => setActiveTab('results')}
                    >
                        Results
                    </button>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Memuat pertandingan...</p>
                ) : Object.keys(groupedMatches).length > 0 ? (
                    Object.values(groupedMatches).map(tournament => (
                        <div key={tournament.id_tournament} className="tournament-group">
                            <div className="tournament-header">
                                <h3 className="tournament-name">{tournament.nama_turnamen}</h3>
                                <span className="tournament-organizer">| {tournament.penyelenggara}</span>
                            </div>

                            {tournament.matches.map(match => (
                                <div key={match.id_match} className="match-card-wrapper" style={{ marginBottom: '15px' }}>
                                    <div className="match-row">
                                        <div className="match-time">{formatTime(match.jadwal)}</div>
                                        <div className="match-teams-container">

                                            {/* TEAM A (KIRI) */}
                                            <div className="team left">
                                                {match.logo_url_a && (
                                                    <img
                                                        src={match.logo_url_a}
                                                        alt={match.nama_tim_a}
                                                        className="team-logo"
                                                        style={{ width: '30px', height: '30px', marginRight: '10px', objectFit: 'contain' }}
                                                    />
                                                )}
                                                {/* FIXED: Menampilkan Nama Tim beserta Singkatannya */}
                                                <span className="team-name">
                                                    {match.nama_tim_a
                                                        ? `${match.nama_tim_a} ${match.singkatan_a ? `(${match.singkatan_a})` : ''}`
                                                        : `Team ${match.id_team_a}`
                                                    }
                                                </span>
                                            </div>

                                            {/* SKOR / VS */}
                                            <div className="match-center">
                                                {activeTab === 'upcoming' ? (
                                                    <span className="match-vs">vs</span>
                                                ) : (
                                                    <span className="match-score">
                                                        {match.skor_akhir_a ?? 0} : {match.skor_akhir_b ?? 0}
                                                    </span>
                                                )}
                                            </div>

                                            {/* TEAM B (KANAN) */}
                                            <div className="team right">
                                                {/* FIXED: Menampilkan Nama Tim beserta Singkatannya */}
                                                <span className="team-name">
                                                    {match.nama_tim_b
                                                        ? `${match.nama_tim_b} ${match.singkatan_b ? `(${match.singkatan_b})` : ''}`
                                                        : `Team ${match.id_team_b}`
                                                    }
                                                </span>
                                                {match.logo_url_b && (
                                                    <img
                                                        src={match.logo_url_b}
                                                        alt={match.nama_tim_b}
                                                        className="team-logo"
                                                        style={{ width: '30px', height: '30px', marginLeft: '10px', objectFit: 'contain' }}
                                                    />
                                                )}
                                            </div>

                                        </div>
                                        <div className="match-format">{match.match_format || "-"}</div>
                                    </div>

                                    {/* Detail maps untuk Tab Results */}
                                    {activeTab === 'results' && match.maps && match.maps.length > 0 && (
                                        <div className="match-maps-box" style={{ background: '#1e1e24', padding: '5px 15px', borderRadius: '0 0 8px 8px', fontSize: '12px', color: '#bbb', display: 'flex', gap: '15px', justifyContent: 'center', borderTop: '1px solid #2d2d35' }}>
                                            {match.maps.map((map) => (
                                                <span key={map.id_match_map}>
                                                    Map {map.map_number} ({map.map_name}): <strong>{map.team_a_score}-{map.team_b_score}</strong>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                        {activeTab === 'upcoming'
                            ? "Tidak Ada Pertandingan Terdekat..."
                            : "Tidak ada hasil pertandingan ditemukan."}
                    </p>
                )}
            </div>
        </div>
    );
}
