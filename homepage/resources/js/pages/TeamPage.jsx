import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TeamPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        fetch(`${API_URL}/api/teams/${id}`)
            .then(res => res.json())
            .then(data => {
                // Pastikan data yang diterima tidak kosong
                if (data && data.team) {
                    setTeam({
                        name: data.team.nama_tim || "Unknown Team",
                        logo: data.team.logo_url || "",
                        players: data.players || [], // Jika null, jadikan array kosong
                        staff: data.staff || []      // Jika null, jadikan array kosong
                    });
                    setLoading(false); // Matikan loading setelah data didapat
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
                        {team.players?.map((p, idx) => (
                            <div className="roster-item" key={idx}>
                                {/* ... */}
                            </div>
                        ))}
                    </div>

                    <h3 className="roster-category staff-mt">STAFF</h3>
                    <div className="roster-grid">
                        {team.staff?.map((s, idx) => (
                            <div className="roster-item" key={idx}>
                                {/* ... */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
