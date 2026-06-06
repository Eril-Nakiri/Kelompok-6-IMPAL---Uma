import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TeamPage() {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "https://kelompok6uma-impal.up.railway.app";

    useEffect(() => {
        fetch(`${API_URL}/api/teams/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.team) {
                    setTeam({
                        name: data.team.nama_tim || "Unknown Team",
                        tag: data.team.singkatan || "",
                        logo: data.team.logo_url || "",
                        players: data.players || []
                    });
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Error fetching team:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading Team...</div>;
    if (!team) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Data tidak ditemukan.</div>;

    return (
        <>
            <Navbar />
            <div className="profile-page-container">
                <div className="profile-header-card">
                    <div className="team-logo-box">
                        <img src={team.logo} alt={team.name} />
                    </div>
                    <div className="profile-title-info">
                        <h1>{team.name}</h1>
                        <span className="team-tag">{team.tag}</span>
                    </div>
                </div>

                <h2 className="section-title">Current Roster</h2>

                <div className="roster-card">
                    <h3 className="roster-category">PLAYERS</h3>
                    <div className="roster-grid">
                        {team.players.map((p, idx) => (
                            <div className="roster-item" key={idx}>
                                <img
                                    src={p.photo_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                    alt={p.nama}
                                    className="roster-photo"
                                />
                                <div className="roster-info">
                                    <div className="roster-ingame-name player-name-with-flag">
                                        {p.flag_url && (
                                            <img
                                                src={p.flag_url}
                                                alt={`Flag ${p.nama_negara || p.nama}`}
                                                className="player-flag"
                                            />
                                        )}
                                        <span>{p.nama}</span>
                                    </div>

                                    <div className="roster-role-tag">{p.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
