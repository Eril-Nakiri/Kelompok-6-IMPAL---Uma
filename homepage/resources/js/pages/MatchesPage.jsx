import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../../css/MatchesPage.css'; // Pastikan path ini sesuai dengan lokasi file CSS Anda

export default function MatchesPage() {
    const [matches, setMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' atau 'results'
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            // Ganti URL ini dengan endpoint API nyata Anda
            // Contoh struktur JSON yang diharapkan ada di komentar bawah
            const res = await fetch(`${API_URL}/api/matches`);
            const data = await res.json();

            if (data.success) {
                setMatches(data.data);
            }
        } catch (error) {
            console.error("Gagal mengambil data matches:", error);
            // MOCK DATA: Hapus bagian ini jika API sudah jalan. Ini agar Anda bisa melihat hasil UI-nya.
            setMatches([
                { id_match: 1, id_tournament: 101, nama_turnamen: "VCT 2024: Pacific Stage 1", penyelenggara: "Riot Games", nama_tim_a: "Paper Rex", nama_tim_b: "T1", match_format: "Bo3", skor_akhir_a: null, skor_akhir_b: null, jadwal: "2024-05-12T16:00:00" },
                { id_match: 2, id_tournament: 101, nama_turnamen: "VCT 2024: Pacific Stage 1", penyelenggara: "Riot Games", nama_tim_a: "DRX", nama_tim_b: "Gen.G", match_format: "Bo3", skor_akhir_a: 2, skor_akhir_b: 1, jadwal: "2024-05-11T14:00:00" },
                { id_match: 3, id_tournament: 102, nama_turnamen: "Challengers League: Indonesia", penyelenggara: "Riot Games", nama_tim_a: "BOOM Esports", nama_tim_b: "Alter Ego", match_format: "Bo1", skor_akhir_a: null, skor_akhir_b: null, jadwal: "2024-05-13T19:00:00" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Filter Data Berdasarkan Tab
    const filteredMatches = matches.filter(match => {
        if (activeTab === 'upcoming') {
            return match.skor_akhir_a === null && match.skor_akhir_b === null;
        } else {
            return match.skor_akhir_a !== null && match.skor_akhir_b !== null;
        }
    });

    // Mengelompokkan Data Berdasarkan Turnamen
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

    // Helper untuk memformat jam (Misal: 2024-05-12T16:00:00 -> 16:00)
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
                                <h3 className="tournament-name">{tournament.nama_turnamen}</h3>
                                <span className="tournament-organizer">| {tournament.penyelenggara}</span>
                            </div>

                            {tournament.matches.map(match => (
                                <div key={match.id_match} className="match-row">

                                    <div className="match-time">
                                        {formatTime(match.jadwal)}
                                    </div>

                                    <div className="match-teams-container">
                                        {/* Tim A */}
                                        <div className="team left">
                                            <span className="team-name">{match.nama_tim_a || `Team ${match.id_teams_a}`}</span>
                                            <div className="team-logo"></div>
                                        </div>

                                        {/* Bagian Tengah (VS / Skor) */}
                                        <div className="match-center">
                                            {activeTab === 'upcoming' ? (
                                                <span className="match-vs">vs</span>
                                            ) : (
                                                <span className="match-score">
                                                    {match.skor_akhir_a} : {match.skor_akhir_b}
                                                </span>
                                            )}
                                        </div>

                                        {/* Tim B */}
                                        <div className="team right">
                                            <div className="team-logo"></div>
                                            <span className="team-name">{match.nama_tim_b || `Team ${match.id_team_b}`}</span>
                                        </div>
                                    </div>

                                    <div className="match-format">
                                        {match.match_format}
                                    </div>

                                </div>
                            ))}
                        </div>
                    ))
                )}

                {!loading && Object.keys(groupedMatches).length === 0 && (
                    <p style={{ textAlign: 'center', color: '#888' }}>Tidak ada pertandingan tersedia.</p>
                )}

            </div>
        </div>
    );
}
