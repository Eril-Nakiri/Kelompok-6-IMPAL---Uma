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

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                console.log("Data diterima:", data);
                setMatches(data);

            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const filteredMatches = matches.filter(match => {
        if (activeTab === 'upcoming') {
            return match.skor_akhir_a === null && match.skor_akhir_b === null;
        } else {
            return match.skor_akhir_a !== null && match.skor_akhir_b !== null;
        }
    });

    const groupedMatches = filteredMatches.reduce((acc, match) => {
        const { id_tournament, nama_turnamen, penyelenggara } = match;
        if (!acc[id_tournament]) {
            acc[id_tournament] = {
                id_tournament,
                nama_turnamen,
                penyelenggara,
                matches: []
            };
        }
        acc[id_tournament].matches.push(match);
        return acc;
    }, {});

    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
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
                ) : (
                    Object.values(groupedMatches).map(tournament => (
                        <div key={tournament.id_tournament} className="tournament-group">
                            <div className="tournament-header">
                                {/* Menambahkan fallback jika nama turnamen kosong */}
                                <h3 className="tournament-name">
                                    {tournament.nama_turnamen || "Turnamen Tanpa Nama"}
                                </h3>
                                <span className="tournament-organizer">
                                    | {tournament.penyelenggara || "Penyelenggara Tidak Diketahui"}
                                </span>
                            </div>

                            {tournament.matches.map(match => (
                                <div key={match.id_match} className="match-row">
                                    <div className="match-time">
                                        {match.jadwal ? formatTime(match.jadwal) : "-"}
                                    </div>

                                    <div className="match-teams-container">
                                        <div className="team left">
                                            {/* Memastikan nama tim muncul */}
                                            <span className="team-name">{match.nama_tim_a || "TBD"}</span>
                                        </div>

                                        <div className="match-center">
                                            {activeTab === 'upcoming' ? (
                                                <span className="match-vs">vs</span>
                                            ) : (
                                                <span className="match-score">
                                                    {match.skor_akhir_a ?? 0} : {match.skor_akhir_b ?? 0}
                                                </span>
                                            )}
                                        </div>

                                        <div className="team right">
                                            <span className="team-name">{match.nama_tim_b || "TBD"}</span>
                                        </div>
                                    </div>

                                    <div className="match-format">
                                        {match.match_format || "-"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
