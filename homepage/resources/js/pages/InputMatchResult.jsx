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
    const [mapTabs, setMapTabs] = useState(['Map 1', 'Map 2', 'Map 3']); // Default fallback

    const [gameData, setGameData] = useState({
        scoreA: '',
        scoreB: '',
        mapName: '',
        mvpPlayer: '',
        mvpAgent: '',
    });

    useEffect(() => {
        if (!tournamentTerpilih) {
            alert('Akses tidak valid. Silakan pilih turnamen terlebih dahulu dari Dashboard.');
            navigate('/dashboard-admin');
            return;
        }

        const fetchMatches = async () => {
            try {
                const response = await fetch('/api/matches');
                const data = await response.json();
                const allMatches = Array.isArray(data) ? data : (data.data || []);

                const filteredMatches = allMatches.filter(m => m.id_tournament === tournamentTerpilih.id_tournament);
                setExistingMatches(filteredMatches);
            } catch (error) {
                console.error("Gagal mengambil data pertandingan:", error);
            } finally {
                setIsLoadingMatches(false);
            }
        };

        fetchMatches();
    }, [tournamentTerpilih, navigate]);

    const handleSelectMatch = (match) => {
        setSelectedMatch(match);

        let mapCount = 3;
        if (match.match_format?.includes('BO1')) mapCount = 1;
        if (match.match_format?.includes('BO5')) mapCount = 5;

        const generatedTabs = Array.from({ length: mapCount }, (_, i) => `Map ${i + 1}`);
        setMapTabs(generatedTabs);
        setActiveMap('Map 1');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGameData({ ...gameData, [name]: value });
    };

    const handleSubmitResult = async (e) => {
        e.preventDefault();

        const payload = {
            ...gameData,
            id_match: selectedMatch.id_match,
            match_format: selectedMatch.match_format,
            current_map: activeMap,
            team_a: selectedMatch.nama_tim_a,
            team_b: selectedMatch.nama_tim_b
        };

        try {
            console.log(`Mengirim hasil ${activeMap}:`, payload);
            alert(`🎉 Skor untuk ${activeMap} (${selectedMatch.nama_tim_a} vs ${selectedMatch.nama_tim_b}) berhasil disimpan!`);

            setGameData({ scoreA: '', scoreB: '', mapName: '', mvpPlayer: '', mvpAgent: '' });
        } catch (error) {
            console.error("Gagal menyimpan hasil match:", error);
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
                    <p className="sub-text">Turnamen Aktif: <strong>{tournamentTerpilih?.nama_turnamen || 'Belum Memilih Turnamen'}</strong></p>
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
                        <h3 style={{ margin: 0 }}>Pilih Pertandingan untuk Diinput Hasilnya</h3>
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
                                        <tr key={m.id_match} style={{ borderBottom: '1px solid #334155', transition: '0.2s' }}>
                                            <td style={{ padding: '16px 8px' }}>{formatWaktu(m.jadwal)}</td>
                                            <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>
                                                {m.nama_tim_a || `Tim A`} <span style={{ color: '#475569' }}>vs</span> {m.nama_tim_b || `Tim B`}
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
                        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum ada pertandingan di turnamen ini. Silakan buat jadwal terlebih dahulu di menu Input Match.</p>
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
                                <input
                                    type="text"
                                    name="mapName"
                                    value={gameData.mapName}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Ascent / Bind / Sunset"
                                    required
                                />
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

                            <div className="form-group-stats">
                                <label>Karakter / Hero MVP</label>
                                <input
                                    type="text"
                                    name="mvpAgent"
                                    value={gameData.mvpAgent}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Jett / Neon / Omen"
                                />
                            </div>
                        </div>

                        <div className="form-actions-area" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
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
