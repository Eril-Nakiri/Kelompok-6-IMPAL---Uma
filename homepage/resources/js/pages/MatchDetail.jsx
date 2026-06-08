import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../../css/MatchDetail.css';

export default function MatchDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMapFilter, setActiveMapFilter] = useState('ALL');

    const resolveMediaUrl = (url) => {
        if (!url) return "https://via.placeholder.com/100";
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${url}`;
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/matches/${id}`);
                const result = await res.json();
                if (result.status === 'success') {
                    setMatchData(result.data);
                } else {
                    alert('Gagal mengambil data pertandingan');
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error("Error Fetch Detail Match:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    if (loading) {
        return <div className="match-detail-page" style={{ textAlign: 'center' }}>Memuat Detail Pertandingan...</div>;
    }

    if (!matchData) return null;

    const { match, tournament, team_a, team_b, players_a, players_b } = matchData;

    const renderPlayerRow = (player, teamName) => {
        return (
            <tr key={player.id_player || player.id}>
                <td>
                    <div className="md-player-cell">
                        <img
                            src={resolveMediaUrl(player.photo_url)}
                            alt={player.nama}
                            className="md-player-photo"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/36" }}
                        />
                        <div>
                            <span className="md-player-name">{player.nama}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                    {player.country ? `🎌 ${player.country}` : '🏳️ TBA'} • {teamName}
                                </span>
                            </div>
                        </div>
                    </div>
                </td>
                <td style={{ textAlign: 'center' }}><span className="md-agent-placeholder">TBA</span></td>
                <td style={{ fontWeight: 'bold' }}>0</td>
                <td>0</td>
                <td>0</td>
                <td style={{ color: '#94a3b8' }}>-</td>
                <td style={{ color: '#10b981', fontWeight: 'bold' }}>0.00</td>
                <td>0.0</td>
                <td>-</td>
                <td style={{ color: '#64748b' }}>0</td>
                <td style={{ color: '#64748b' }}>0</td>
            </tr>
        );
    };

    return (
        <div className="match-detail-page">
            <Navbar />

            <div className="md-container">
                <button className="back-portal-btn" onClick={() => navigate('/dashboard')}>
                    🔙 Kembali ke Dashboard
                </button>

                <div className="md-header-card">
                    <div className="md-tournament-name">
                        🏆 {tournament?.nama_turnamen || "VALORANT Champions Tour 2026"}
                    </div>

                    <div className="md-vs-row">
                        <div className="md-team-block">
                            <img src={resolveMediaUrl(team_a?.logo_url)} alt="Logo A" className="md-team-logo" />
                            <span className="md-team-name">{team_a?.nama_tim || "TEAM A"}</span>
                        </div>
                        <div className="md-vs-circle">VS</div>
                        <div className="md-team-block">
                            <img src={resolveMediaUrl(team_b?.logo_url)} alt="Logo B" className="md-team-logo" />
                            <span className="md-team-name">{team_b?.nama_tim || "TEAM B"}</span>
                        </div>
                    </div>

                    <div className="md-match-meta">
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>{match?.match_format || 'BO3'} Series</span>
                        {" • "}
                        <span>📅 {match?.jadwal ? new Date(match.jadwal).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) + " WIB" : "Jadwal TBA"}</span>
                    </div>
                </div>

                <div className="md-stats-section">

                    <div className="md-filter-row">
                        <button className={`md-filter-btn ${activeMapFilter === 'ALL' ? 'active' : ''}`} onClick={() => setActiveMapFilter('ALL')}>ALL MAPS</button>
                        <button className="md-filter-btn" disabled>MAP 1 (TBA)</button>
                        <button className="md-filter-btn" disabled>MAP 2 (TBA)</button>
                        <button className="md-filter-btn" disabled>MAP 3 (TBA)</button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="md-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Player</th>
                                    <th style={{ textTransform: 'uppercase', textAlign: 'center' }}>Agent</th>
                                    <th>K</th>
                                    <th>D</th>
                                    <th>A</th>
                                    <th>+/-</th>
                                    <th>ACS</th>
                                    <th>Rating</th>
                                    <th>HS%</th>
                                    <th>FK</th>
                                    <th>FD</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="11" className="team-header-divider">
                                        🟢 KELOMPOK PEMAIN: {team_a?.nama_tim || "TEAM A"}
                                    </td>
                                </tr>
                                {players_a.length > 0 ? (
                                    players_a.map(player => renderPlayerRow(player, team_a?.singkatan || "TM A"))
                                ) : (
                                    <tr><td colSpan="11" className="no-news-info">Belum ada roster terdaftar di tim ini.</td></tr>
                                )}

                                <tr>
                                    <td colSpan="11" className="team-header-divider">
                                        🔵 KELOMPOK PEMAIN: {team_b?.nama_tim || "TEAM B"}
                                    </td>
                                </tr>
                                {players_b.length > 0 ? (
                                    players_b.map(player => renderPlayerRow(player, team_b?.singkatan || "TM B"))
                                ) : (
                                    <tr><td colSpan="11" className="no-news-info">Belum ada roster terdaftar di tim ini.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}
