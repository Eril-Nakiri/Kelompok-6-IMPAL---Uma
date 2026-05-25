import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TeamPage() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        fetch(`${API_URL}/api/teams/${id}`)
            .then(res => res.json())
            .then(data => {
                setTeam({
                    name: data.team.nama_tim,
                    logo: data.team.logo_url,
                    players: data.players
                });
            })
            .catch(err => console.error("Error fetching team:", err));
    }, [id]);

    if (!team) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading Team...</div>;

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
                                <img src={p.photo} alt={p.name} className="roster-photo" />
                                <div className="roster-info">
                                    <div className="roster-ingame-name">
                                        <span className="roster-flag">🏳️</span> {p.name}
                                    </div>
                                    <div className="roster-real-name">{p.realName}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className="roster-category staff-mt">STAFF</h3>
                    <div className="roster-grid">
                        {team.staff.map((s, idx) => (
                            <div className="roster-item" key={idx}>
                                <img src={s.photo} alt={s.name} className="roster-photo" />
                                <div className="roster-info">
                                    <div className="roster-ingame-name">
                                        <span className="roster-flag">🏳️</span> {s.name}
                                    </div>
                                    <div className="roster-real-name">{s.realName}</div>
                                    <div className="roster-role-tag">{s.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
