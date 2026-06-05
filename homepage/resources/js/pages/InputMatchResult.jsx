import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/InputMatchResult.css';

export default function InputMatchResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const tournamentTerpilih = location.state?.tournament;

    const [existingMatches, setExistingMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isLoadingMatches, setIsLoadingMatches] = useState(true);

    const [activeMap, setActiveMap] = useState('Map 1');
    const [mapTabs, setMapTabs] = useState(['Map 1', 'Map 2', 'Map 3']);

    const [maps] = useState([
        "Ascent", "Bind", "Breeze", "Abyss", "Fracture",
        "Haven", "Icebox", "Lotus", "Pearl", "Split", "Sunset"
    ]);

    const [agents, setAgents] = useState([]);

    const [rosterA, setRosterA] = useState([]);
    const [rosterB, setRosterB] = useState([]);

    const [gameData, setGameData] = useState({
        scoreA: '',
        scoreB: '',
        mapName: '',
        mvpPlayer: '',
    });

    const emptyPlayer = { id_player: '', agent: '', kills: '', deaths: '', assists: '', acs: '', rating: '', hs: '', fk: '', fd: '' };
    const [teamAStats, setTeamAStats] = useState(Array.from({ length: 5 }, () => ({ ...emptyPlayer })));
    const [teamBStats, setTeamBStats] = useState(Array.from({ length: 5 }, () => ({ ...emptyPlayer })));

    useEffect(() => {
        if (!tournamentTerpilih) {
            alert('Akses tidak valid. Silakan pilih turnamen terlebih dahulu dari Dashboard.');
            navigate('/dashboard-admin');
            return;
        }

        const fetchData = async () => {
            try {
                const resMatches = await fetch('/api/matches');
                const dataMatches = await resMatches.json();
                const allMatches = Array.isArray(dataMatches) ? dataMatches : (dataMatches.data || []);
                const filteredMatches = allMatches.filter(m => m.id_tournament === tournamentTerpilih.id_tournament || m.id_tournament === tournamentTerpilih.id);
                setExistingMatches(filteredMatches);

                const resAgents = await fetch('/api/agents');
                const dataAgents = await resAgents.json();
                setAgents(dataAgents.data || []);

            } catch (error) {
                console.error("Gagal mengambil data dari server:", error);
            } finally {
                setIsLoadingMatches(false);
            }
        };

        fetchData();
    }, [tournamentTerpilih, navigate]);

    const handleSelectMatch = async (match) => {
        setSelectedMatch(match);
        const format = match.match_format || 'BO3';

        let mapCount = 3;
        if (format.includes('BO1')) mapCount = 1;
        if (format.includes('BO5')) mapCount = 5;

        const generatedTabs = Array.from({ length: mapCount }, (_, i) => `Map ${i + 1}`);
        setMapTabs(generatedTabs);
        setActiveMap('Map 1');

        try {
            const resA = await fetch(`/api/teams/${match.id_team_a}/players`);
            const dataA = await resA.json();
            setRosterA(dataA.data || []);

            const resB = await fetch(`/api/teams/${match.id_team_b}/players`);
            const dataB = await resB.json();
            setRosterB(dataB.data || []);
        } catch (error) {
            console.error("Gagal mengambil daftar pemain:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGameData({ ...gameData, [name]: value });
    };

    const handleTeamAChange = (index, field, value) => {
        const newStats = [...teamAStats];
        newStats[index][field] = value;
        setTeamAStats(newStats);
    };

    const handleTeamBChange = (index, field, value) => {
        const newStats = [...teamBStats];
        newStats[index][field] = value;
        setTeamBStats(newStats);
    };

    const handleSubmitResult = async (e) => {
        e.preventDefault();

        const payload = {
            id_match: selectedMatch.id_match || selectedMatch.id,
            match_format: selectedMatch.match_format,
            current_map: activeMap,
            team_a: selectedMatch.nama_tim_a,
            team_b: selectedMatch.nama_tim_b,
            game_data: gameData,
            player_stats: {
                teamA: teamAStats,
                teamB: teamBStats
            }
        };

        try {
            const response = await fetch('/api/match-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok || result.status === 'success') {
                alert(`🎉 Skor, MVP, dan Statistik Pemain untuk ${activeMap} berhasil direkam di database!`);
            } else {
                alert(`Gagal menyimpan data: ${result.message || 'Kesalahan server'}`);
            }
        } catch (error) {
            console.error("Gagal mengirim hasil match ke server:", error);
            alert("Gagal terhubung ke server backend.");
        }
    };

    const formatWaktu = (jadwal) => {
        const date = new Date(jadwal);
        return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div className="mr-container">
            <header className="mr-header">
                <div className="mr-title-area">
                    <h2>Input Match Result</h2>
                    <p className="sub-text">Turnamen Aktif: <strong>{tournamentTerpilih?.nama_turnamen || tournamentTerpilih?.name || 'Belum Memilih Turnamen'}</strong></p>
                </div>

                {selectedMatch && (
                    <div className="active-match-badge">
                        <span className="badge-pulse"></span>
                        <span className="badge-text">
                            Match Active: <strong className="highlight-team">{selectedMatch.nama_tim_a} vs {selectedMatch.nama_tim_b}</strong>
                            <span className="map-indicator"> ({activeMap})</span>
                        </span>
                    </div>
                )}
            </header>

            {!selectedMatch ? (
                <div className="mr-form-card" style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: '#FFF' }}>Pilih Pertandingan untuk Diinput Hasilnya</h3>
                        <button
                            className="save-result-btn"
                            style={{ backgroundColor: '#475569', width: 'auto', padding: '8px 16px' }}
                            onClick={() => navigate('/dashboard-admin')}
                        >
                            🔙 Kembali ke Dashboard
                        </button>
                    </div>

                    {isLoadingMatches ? (
                        <p style={{ color: '#94a3b8' }}>Memuat jadwal pertandingan...</p>
                    ) : existingMatches.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                                        <th style={{ padding: '12px 8px' }}>Jadwal</th>
                                        <th style={{ padding: '12px 8px' }}>Tim Bertanding</th>
                                        <th style={{ padding: '12px 8px' }}>Format</th>
                                        <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {existingMatches.map(m => (
                                        <tr key={m.id_match} style={{ borderBottom: '1px solid #334155', transition: '0.2s', color: '#FFF' }}>
                                            <td style={{ padding: '16px 8px' }}>{formatWaktu(m.jadwal)}</td>
                                            <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>
                                                {m.nama_tim_a} <span style={{ color: '#475569' }}>vs</span> {m.nama_tim_b}
                                            </td>
                                            <td style={{ padding: '16px 8px', color: '#10b981' }}>{m.match_format}</td>
                                            <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                                <button
                                                    style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                    onClick={() => handleSelectMatch(m)}
                                                >
                                                    Input Hasil ➔
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum ada jadwal pertandingan yang terdaftar di turnamen ini.</p>
                    )}
                </div>
            ) : (
                <>
                    <div className="bo3-selector-tabs">
                        {mapTabs.map((map) => (
                            <button
                                key={map}
                                type="button"
                                className={`tab-btn ${activeMap === map ? 'active' : ''}`}
                                onClick={() => setActiveMap(map)}
                            >
                                {map}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmitResult} className="mr-form-card">
                        <div className="form-section-title">
                            <h3>Input Data Pertandingan - {activeMap}</h3>
                            <p>Silakan lengkapi perolehan skor akhir dan statistik ronde game di bawah ini untuk <strong>{selectedMatch.match_format}</strong>.</p>
                        </div>

                        <div className="form-row flex-score-row">
                            <div className="form-group-score">
                                <label>Skor Akhir {selectedMatch.nama_tim_a}</label>
                                <input
                                    type="number"
                                    name="scoreA"
                                    value={gameData.scoreA}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="score-separator">VS</div>

                            <div className="form-group-score">
                                <label>Skor Akhir {selectedMatch.nama_tim_b}</label>
                                <input
                                    type="number"
                                    name="scoreB"
                                    value={gameData.scoreB}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <hr className="form-divider" />

                        <div className="form-grid-stats">
                            <div className="form-group-stats">
                                <label>Nama Map Game</label>
                                <select
                                    name="mapName"
                                    value={gameData.mapName}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>-- Pilih Map --</option>
                                    {maps.map(map => (
                                        <option key={map} value={map}>{map}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group-stats">
                                <label>Pemain Terpilih (MVP)</label>
                                <input
                                    type="text"
                                    name="mvpPlayer"
                                    value={gameData.mvpPlayer}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: f0rsakeN / Chronicle"
                                />
                            </div>
                        </div>

                        <div className="player-stats-wrapper">
                            <h3 style={{ color: '#3B82F6', marginBottom: '16px', fontSize: '16px' }}>Statistik Pemain - {selectedMatch.nama_tim_a}</h3>
                            <div className="stats-table-container">
                                <table className="player-stats-table">
                                    <thead>
                                        <tr>
                                            <th className="left-align" style={{ width: '200px' }}>Pemain</th>
                                            <th>Agent</th>
                                            <th>K</th>
                                            <th>D</th>
                                            <th>A</th>
                                            <th>ACS</th>
                                            <th>Rating</th>
                                            <th>HS%</th>
                                            <th>FK</th>
                                            <th>FD</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamAStats.map((player, idx) => (
                                            <tr key={`teamA-${idx}`}>
                                                <td className="left-align">
                                                    <select className="player-stat-input left-align" value={player.id_player} onChange={e => handleTeamAChange(idx, 'id_player', e.target.value)}>
                                                        <option value="">-- Pilih Pemain --</option>
                                                        {rosterA.map(p => (
                                                            <option key={p.id_player} value={p.id_player}>
                                                                {p.ingame_name || p.nama_player || p.nickname || `Player ${p.id_player}`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <select className="agent-select" value={player.agent} onChange={e => handleTeamAChange(idx, 'agent', e.target.value)}>
                                                        <option value="">Pilih...</option>
                                                        {agents.map(ag => <option key={ag.id_agent} value={ag.id_agent}>{ag.nama_agent}</option>)}
                                                    </select>
                                                </td>
                                                <td><input type="number" className="player-stat-input" value={player.kills} onChange={e => handleTeamAChange(idx, 'kills', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.deaths} onChange={e => handleTeamAChange(idx, 'deaths', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.assists} onChange={e => handleTeamAChange(idx, 'assists', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.acs} onChange={e => handleTeamAChange(idx, 'acs', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" step="0.1" className="player-stat-input" value={player.rating} onChange={e => handleTeamAChange(idx, 'rating', e.target.value)} min="0" placeholder="0.0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.hs} onChange={e => handleTeamAChange(idx, 'hs', e.target.value)} min="0" max="100" placeholder="%" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.fk} onChange={e => handleTeamAChange(idx, 'fk', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.fd} onChange={e => handleTeamAChange(idx, 'fd', e.target.value)} min="0" placeholder="0" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="player-stats-wrapper">
                            <h3 style={{ color: '#EF4444', marginBottom: '16px', fontSize: '16px' }}>Statistik Pemain - {selectedMatch.nama_tim_b}</h3>
                            <div className="stats-table-container" style={{ marginBottom: 0 }}>
                                <table className="player-stats-table">
                                    <thead>
                                        <tr>
                                            <th className="left-align" style={{ width: '200px' }}>Pemain</th>
                                            <th>Agent</th>
                                            <th>K</th>
                                            <th>D</th>
                                            <th>A</th>
                                            <th>ACS</th>
                                            <th>Rating</th>
                                            <th>HS%</th>
                                            <th>FK</th>
                                            <th>FD</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamBStats.map((player, idx) => (
                                            <tr key={`teamB-${idx}`}>
                                                <td className="left-align">
                                                    <select className="player-stat-input left-align" value={player.id_player} onChange={e => handleTeamBChange(idx, 'id_player', e.target.value)}>
                                                        <option value="">-- Pilih Pemain --</option>
                                                        {rosterB.map(p => (
                                                            <option key={p.id_player} value={p.id_player}>
                                                                {p.ingame_name || p.nama_player || p.nickname || `Player ${p.id_player}`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <select className="agent-select" value={player.agent} onChange={e => handleTeamBChange(idx, 'agent', e.target.value)}>
                                                        <option value="">Pilih...</option>
                                                        {agents.map(ag => <option key={ag.id_agent} value={ag.id_agent}>{ag.nama_agent}</option>)}
                                                    </select>
                                                </td>
                                                <td><input type="number" className="player-stat-input" value={player.kills} onChange={e => handleTeamBChange(idx, 'kills', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.deaths} onChange={e => handleTeamBChange(idx, 'deaths', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.assists} onChange={e => handleTeamBChange(idx, 'assists', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.acs} onChange={e => handleTeamBChange(idx, 'acs', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" step="0.1" className="player-stat-input" value={player.rating} onChange={e => handleTeamBChange(idx, 'rating', e.target.value)} min="0" placeholder="0.0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.hs} onChange={e => handleTeamBChange(idx, 'hs', e.target.value)} min="0" max="100" placeholder="%" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.fk} onChange={e => handleTeamBChange(idx, 'fk', e.target.value)} min="0" placeholder="0" /></td>
                                                <td><input type="number" className="player-stat-input" value={player.fd} onChange={e => handleTeamBChange(idx, 'fd', e.target.value)} min="0" placeholder="0" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="form-actions-area">
                            <button
                                type="button"
                                className="save-result-btn"
                                style={{ backgroundColor: '#475569' }}
                                onClick={() => setSelectedMatch(null)}
                            >
                                🔙 Pilih Match Lain
                            </button>
                            <button type="submit" className="save-result-btn">
                                💾 Simpan Hasil {activeMap}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
