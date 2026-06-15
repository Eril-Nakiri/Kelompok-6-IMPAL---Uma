import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../../css/DetailEvent.css';

export default function DetailEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeStageTab, setActiveStageTab] = useState('SWISS');

    const resolveMediaUrl = (url) => {
        if (!url) return "https://via.placeholder.com/40";
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${url}`;
    };

    useEffect(() => {
        const fetchTournamentDetail = async () => {
            try {
                const res = await fetch(`/api/tournament/${id}`);
                const result = await res.json();
                if (result.status === 'success') {
                    setEventData(result.data);
                } else {
                    alert('Gagal mengambil detail turnamen');
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error("Error Fetch Detail Tournament:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTournamentDetail();
    }, [id, navigate]);

    if (loading) {
        return <div className="detail-event-page" style={{ textAlign: 'center' }}>Memuat Detail Event Turnamen...</div>;
    }

    if (!eventData) return null;

    const { tournament, teams } = eventData;

    return (
        <div className="detail-event-page">
            <Navbar />

            <div className="de-container">
                <button className="de-back-btn" onClick={() => navigate('/dashboard')}>
                    🔙 Kembali ke Dashboard
                </button>

                <div className="de-header-card">
                    {tournament.logo_url && (
                        <img src={resolveMediaUrl(tournament.logo_url)} alt="T-Logo" className="de-logo-img" />
                    )}
                    <div className="de-title-block">
                        <h1>{tournament.nama_turnamen || "VALORANT Tournament"}</h1>
                        <p>Penyelenggara: <strong>{tournament.penyelenggara || "VLR"}</strong></p>
                    </div>
                </div>

                <div className="de-section-box">
                    <h3 className="de-section-title">Tournament Brackets & Stage Progress</h3>
                    <div className="de-tab-row">
                        <button
                            className={`de-tab-btn ${activeStageTab === 'SWISS' ? 'active' : ''}`}
                            onClick={() => setActiveStageTab('SWISS')}
                        >
                            🇨🇭 Swiss Stage
                        </button>
                        <button
                            className={`de-tab-btn ${activeStageTab === 'PLAYOFF' ? 'active' : ''}`}
                            onClick={() => setActiveStageTab('PLAYOFF')}
                        >
                            🏆 Playoffs Bracket
                        </button>
                    </div>

                    <div className="de-image-wrapper">
                        {activeStageTab === 'SWISS' ? (
                            <img
                                src="https://i.ibb.co.com/tMTdzyLL/Swiss-Stage.png"
                                alt="Swiss Stage Progress"
                                className="de-playoffs-img"
                            />
                        ) : (
                            <img
                                src="https://i.ibb.co.com/CKfnq7cj/Playoffs.png"
                                alt="Playoffs Brackets Diagram"
                                className="de-playoffs-img"
                            />
                        )}
                    </div>
                </div>

                <div className="de-section-box">
                    <h3 className="de-section-title">Tim yang Berpartisipasi</h3>
                    <div className="de-teams-grid">
                        {teams && teams.length > 0 ? (
                            teams.map((team, idx) => (
                                <div
                                    key={team.id_team || idx}
                                    className="de-team-card"
                                    onClick={() => {
                                        if (team.id_team) {
                                            navigate(`/teams/${team.id_team}`);
                                        }
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff4654'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3a3a5a'}
                                >
                                    <img
                                        src={resolveMediaUrl(team.logo_url)}
                                        alt="T-Logo"
                                        className="de-team-logo-img"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/40" }}
                                    />
                                    <div className="de-team-info">
                                        <span className="de-team-name">{team.nama_tim}</span>
                                        <span className="de-team-tag">{team.singkatan || "VCT"}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#94a3b8', fontStyle: 'italic', gridColumn: '1/-1', textAlign: 'center', padding: '10px' }}>
                                Belum ada data tim yang terdaftar di jadwal pertandingan turnamen ini.
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
