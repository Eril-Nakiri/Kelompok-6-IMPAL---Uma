import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/InputMatchResult.css';

export default function InputMatchResult() {
    const location = useLocation();

    const tournamentTerpilih = location.state?.tournament;

    const [activeMap, setActiveMap] = useState('Map 1');

    const [matchInfo] = useState({
        teamA: 'PRX',
        teamB: 'Fnatic',
        tournamentName: tournamentTerpilih ? tournamentTerpilih.name : 'Belum Memilih Turnamen'
    });

    const [gameData, setGameData] = useState({
        scoreA: '',
        scoreB: '',
        mapName: '',
        mvpPlayer: '',
        mvpAgent: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGameData({ ...gameData, [name]: value });
    };

    const handleSubmitResult = async (e) => {
        e.preventDefault();

        const payload = {
            ...gameData,
            match_format: 'BO3',
            current_map: activeMap,
            team_a: matchInfo.teamA,
            team_b: matchInfo.teamB
        };

        try {
            console.log("Mengirim hasil pertandingan BO3:", payload);
            alert(`🎉 Skor untuk ${activeMap} (${matchInfo.teamA} vs ${matchInfo.teamB}) berhasil disimpan!`);
        } catch (error) {
            console.error("Gagal menyimpan hasil match:", error);
        }
    };

    return (
        <div className="mr-container">
            <header className="mr-header">
                <div className="mr-title-area">
                    <h2>Input Match Result</h2>
                    <p className="sub-text">Turnamen Aktif: <strong>{matchInfo.tournamentName}</strong></p>
                </div>

                <div className="active-match-badge">
                    <span className="badge-pulse"></span>
                    <span className="badge-text">
                        Match Active: <strong className="highlight-team">{matchInfo.teamA} vs {matchInfo.teamB}</strong>
                        <span className="map-indicator"> ({activeMap})</span>
                    </span>
                </div>
            </header>

            <div className="bo3-selector-tabs">
                {['Map 1', 'Map 2', 'Map 3'].map((map) => (
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
                    <p>Silakan lengkapi perolehan skor akhir dan statistik ronde game di bawah ini.</p>
                </div>

                <div className="form-row flex-score-row">
                    <div className="form-group-score">
                        <label>Skor Akhir {matchInfo.teamA}</label>
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
                        <label>Skor Akhir {matchInfo.teamB}</label>
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

                <div className="form-actions-area">
                    <button type="submit" className="save-result-btn">
                        💾 Simpan Hasil {activeMap}
                    </button>
                </div>
            </form>
        </div>
    );
}
