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
    const [availableMaps, setAvailableMaps] = useState([]);

    const resolveMediaUrl = (url) => {
        if (!url) return null;
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

                    const statsArr = result.data.stats || [];
                    const uniqueMaps = [...new Set(statsArr.map(s => s.map_name).filter(Boolean))];
                    setAvailableMaps(uniqueMaps);
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

    const { match, tournament, team_a, team_b, players_a, players_b, stats, agents, countries } = matchData;

    const agentsMap = {};
    (agents || []).forEach(ag => { agentsMap[ag.id_agent] = ag; });

    const countriesMap = {};
    (countries || []).forEach(c => {
        if(c.nama_negara) countriesMap[c.nama_negara.toLowerCase()] = c;
    });

    const getCalculatedStats = (players) => {
        return players.map(player => {
            const playerAllStats = (stats || []).filter(s => s.id_player === player.id_player);

            if (playerAllStats.length === 0) {
                return {
                    ...player, usedAgents: [], k: 0, d: 0, a: 0, kdDiff: 0,
                    acs: 0, rating: 0.00, hs: '0%', fk: 0, fd: 0, fkfdDiff: 0
                };
            }

            const filteredStats = activeMapFilter === 'ALL'
                ? playerAllStats
                : playerAllStats.filter(s => s.map_name === activeMapFilter);

            if (filteredStats.length === 0) {
                return {
                    ...player, usedAgents: [], k: 0, d: 0, a: 0, kdDiff: 0,
                    acs: 0, rating: 0.00, hs: '0%', fk: 0, fd: 0, fkfdDiff: 0
                };
            }

            const k = filteredStats.reduce((sum, s) => sum + parseInt(s.kills || 0), 0);
            const d = filteredStats.reduce((sum, s) => sum + parseInt(s.deaths || 0), 0);
            const a = filteredStats.reduce((sum, s) => sum + parseInt(s.assists || 0), 0);
            const fk = filteredStats.reduce((sum, s) => sum + parseInt(s.first_kills || 0), 0);
            const fd = filteredStats.reduce((sum, s) => sum + parseInt(s.first_deaths || 0), 0);

            const kdDiff = k - d;
            const fkfdDiff = fk - fd;

            const totalPlayed = filteredStats.length;
            const acs = Math.round(filteredStats.reduce((sum, s) => sum + parseFloat(s.acs || 0), 0) / totalPlayed);
            const rating = (filteredStats.reduce((sum, s) => sum + parseFloat(s.rating || 0), 0) / totalPlayed).toFixed(2);
            const hs = Math.round(filteredStats.reduce((sum, s) => sum + parseFloat(s.hs_percentage || 0), 0) / totalPlayed) + "%";

            const usedAgents = [...new Set(filteredStats.map(s => s.id_agent).filter(Boolean))];

            return { ...player, usedAgents, k, d, a, kdDiff, acs, rating, hs, fk, fd, fkfdDiff };
        });
    };

    const renderDiffClass = (val) => {
        if (val > 0) return "diff-positive";
        if (val < 0) return "diff-negative";
        return "diff-neutral";
    };

    const processedPlayersA = getCalculatedStats(players_a);
    const processedPlayersB = getCalculatedStats(players_b);

    const renderRows = (processedPlayers, teamSingkatan) => {
        return processedPlayers.map(p => {
            const photoSrc = resolveMediaUrl(p.photo_url);

            const countryName = p.country || "TBA";
            const cData = p.country ? countriesMap[p.country.toLowerCase()] : null;
            const flagSrc = cData ? resolveMediaUrl(cData.flag_url) : null;

            return (
                <tr key={p.id_player}>
                    <td>
                        <div className="md-player-cell">
                            {photoSrc ? (
                                <img
                                    src={photoSrc} alt="P" className="md-player-photo"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="md-player-photo-empty"></div>
                            )}

                            <div>
                                <span className="md-player-name">{p.nama}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                    {flagSrc ? (
                                        <img src={flagSrc} alt="flag" className="md-flag-real" title={countryName} />
                                    ) : (
                                        <span style={{ fontSize: '11px' }}>🏳️</span>
                                    )}
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                        {countryName} • {teamSingkatan}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                        {p.usedAgents && p.usedAgents.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {p.usedAgents.map(agId => {
                                    const ag = agentsMap[agId];
                                    if (!ag) return null;
                                    return (
                                        <div key={agId} className="agent-badge">
                                            {ag.icon_url && <img src={resolveMediaUrl(ag.icon_url)} alt="Agent" className="agent-icon" />}
                                            <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 'bold' }}>{ag.nama_agent}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <span className="md-agent-placeholder">TBA</span>
                        )}
                    </td>

                    <td style={{ fontWeight: '600' }}>{p.k}</td>
                    <td>{p.d}</td>
                    <td>{p.a}</td>

                    <td className={renderDiffClass(p.kdDiff)}>{p.kdDiff > 0 ? `+${p.kdDiff}` : p.kdDiff}</td>

                    <td style={{ color: '#cbd5e1' }}>{p.acs}</td>
                    <td style={{ color: '#10b981', fontWeight: 'bold' }}>{p.rating}</td>
                    <td>{p.hs}</td>
                    <td style={{ color: '#a855f7' }}>{p.fk}</td>
                    <td style={{ color: '#f43f5e' }}>{p.fd}</td>

                    <td className={renderDiffClass(p.fkfdDiff)}>{p.fkfdDiff > 0 ? `+${p.fkfdDiff}` : p.fkfdDiff}</td>
                </tr>
            );
        });
    };

    return (
        <div className="match-detail-page">
            <Navbar />

            <div className="md-container">
                <button className="back-portal-btn" onClick={() => navigate('/matches')}>
                    🔙 Kembali ke Menu Matches
                </button>

                <div className="md-header-card">
                    <div className="md-tournament-name">
                        {tournament?.nama_turnamen || "VALORANT Champions Tour 2026"}
                    </div>

                    <div className="md-vs-row">
                        <div className="md-team-block">
                            <img src={resolveMediaUrl(team_a?.logo_url)} alt="L-A" className="md-team-logo" />
                            <span className="md-team-name">{team_a?.nama_tim || "TEAM A"}</span>
                        </div>

                        <div className="md-vs-circle">
                            {(() => {
                                if (match?.jadwal && new Date(match.jadwal) > new Date()) {
                                    return "VS";
                                }

                                if (activeMapFilter === 'ALL') {
                                    return match?.skor_akhir_a !== null
                                        ? `${match.skor_akhir_a} : ${match.skor_akhir_b}`
                                        : "VS";
                                }

                                const currentMapData = (matchData.maps || []).find(
                                    m => m.map_name === activeMapFilter
                                );

                                if (currentMapData && currentMapData.team_a_score !== null) {
                                    return `${currentMapData.team_a_score} : ${currentMapData.team_b_score}`;
                                }

                                return "- : -";
                            })()}
                        </div>

                        <div className="md-team-block">
                            <img src={resolveMediaUrl(team_b?.logo_url)} alt="L-B" className="md-team-logo" />
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
                        <button
                            className={`md-filter-btn ${activeMapFilter === 'ALL' ? 'active' : ''}`}
                            onClick={() => setActiveMapFilter('ALL')}
                        >
                            ALL MAPS
                        </button>

                        {availableMaps.map((mapName, index) => (
                            <button
                                key={index}
                                className={`md-filter-btn ${activeMapFilter === mapName ? 'active' : ''}`}
                                onClick={() => setActiveMapFilter(mapName)}
                            >
                                Map {index + 1} ({mapName})
                            </button>
                        ))}

                        {availableMaps.length === 0 && (
                            <>
                                <button className="md-filter-btn" disabled>Map 1 (TBA)</button>
                                <button className="md-filter-btn" disabled>Map 2 (TBA)</button>
                            </>
                        )}
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="md-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '22%' }}>Player</th>
                                    <th style={{ textAlign: 'center' }}>Agent</th>
                                    <th>K</th>
                                    <th>D</th>
                                    <th>A</th>
                                    <th>+/-</th>
                                    <th>ACS</th>
                                    <th>Rating</th>
                                    <th>HS%</th>
                                    <th>FK</th>
                                    <th>FD</th>
                                    <th>+/-</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="12" className="team-header-divider">
                                        🟢 ROSTER SQUAD: {team_a?.nama_tim}
                                    </td>
                                </tr>
                                {renderRows(processedPlayersA, team_a?.singkatan || "TIM A")}

                                <tr>
                                    <td colSpan="12" className="team-header-divider">
                                        🔵 ROSTER SQUAD: {team_b?.nama_tim}
                                    </td>
                                </tr>
                                {renderRows(processedPlayersB, team_b?.singkatan || "TIM B")}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}
