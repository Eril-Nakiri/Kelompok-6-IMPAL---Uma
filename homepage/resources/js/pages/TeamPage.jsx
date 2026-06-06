import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TeamPage() {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "https://kelompok6uma-impal.up.railway.app";

    useEffect(() => {
        async function fetchTeam() {
            try {
                setLoading(true);

                const res = await fetch(`${API_URL}/api/teams/${id}`);
                const text = await res.text();

                let data;
                try {
                    data = JSON.parse(text);
                } catch {
                    console.error("Response bukan JSON:", text);
                    throw new Error("Server mengirim HTML/error page, bukan JSON.");
                }

                if (!res.ok) {
                    throw new Error(data.message || "Gagal mengambil detail team.");
                }

                if (data && data.team) {
                    setTeam({
                        name: data.team.nama_tim || "Unknown Team",
                        tag: data.team.singkatan || "",
                        logo: data.team.logo_url || "",
                        players: data.players || []
                    });
                } else {
                    setTeam(null);
                }
            } catch (err) {
                console.error("Error fetching team:", err);
                setTeam(null);
            } finally {
                setLoading(false);
            }
        }

        fetchTeam();
    }, [id, API_URL]);

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
                            <div className="roster-item" key={p.id_player || idx}>
                                <img
                                    src={p.photo_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                    alt={p.nama}
                                    className="roster-photo"
                                />
                                <div className="roster-info">
                                    <div
                                        className="roster-ingame-name player-name-with-flag"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        {p.flag_url && (
                                            <img
                                                src={p.flag_url}
                                                alt={p.nama_negara || p.nama}
                                                className="player-flag"
                                                style={{
                                                    width: '22px',
                                                    height: '15px',
                                                    objectFit: 'cover',
                                                    borderRadius: '2px',
                                                    flexShrink: 0
                                                }}
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
