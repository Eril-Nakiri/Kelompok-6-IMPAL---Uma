import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TeamPage() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        // TODO: Nanti sambungkan dengan API aslimu (contoh: fetch(`${API_URL}/api/teams/${id}`))
        // Sementara kita pakai data tiruan (Mock Data) agar desain Figma langsung terlihat
        setTeam({
            id: id,
            name: "Paper Rex",
            tag: "PRX",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Paper_Rex_logo.svg/1200px-Paper_Rex_logo.svg.png",
            players: [
                { name: "invy", realName: "Adrian Jiggs Reyes", country: "Philippines", photo: "https://owcdn.net/img/63c5c9ba6cefa.png" },
                { name: "Jinggg", realName: "Wang Jing Jie", country: "Singapore", photo: "https://owcdn.net/img/6225b6c00d5a3.png" },
                { name: "f0rsakeN", realName: "Jason Susanto", country: "Indonesia", photo: "https://owcdn.net/img/603c4672e6189.png" },
                { name: "d4v41", realName: "Khalish Rusyaidee", country: "Malaysia", photo: "https://owcdn.net/img/603c467f3388c.png" },
                { name: "something", realName: "Ilya Petrov", country: "Russia", photo: "https://owcdn.net/img/64293f0b2daab.png" },
            ],
            staff: [
                { name: "Tommy", realName: "Kumaresan Ramani", country: "Singapore", role: "MANAGER", photo: "https://owcdn.net/img/65e97bd9a175f.png" },
                { name: "alecks", realName: "Alexandre Sallé", country: "France", role: "COACH", photo: "https://owcdn.net/img/6225b6d51624c.png" },
                { name: "Wendler", realName: "Ashton Wendler", country: "United States", role: "ASSISTANT COACH", photo: "https://owcdn.net/img/663ccb05ea8bb.png" },
                { name: "Panda", realName: "Laijhun Cheng", country: "United States", role: "PERFORMANCE COACH", photo: "https://owcdn.net/img/663ccb0e6dfbc.png" },
            ]
        });
    }, [id]);

    if (!team) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading Team...</div>;

    return (
        <>
            <Navbar />
            <div className="profile-page-container">
                {/* HEADER TIM */}
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

                {/* DAFTAR ROSTER */}
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
