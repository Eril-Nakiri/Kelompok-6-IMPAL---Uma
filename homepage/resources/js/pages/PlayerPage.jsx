import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PlayerPage() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        fetch(`${API_URL}/api/players/${id}`)
            .then(res => res.json())
            .then(data => {
                setPlayer({
                    name: data.player.nama,
                    country: data.player.country,
                    photo: data.player.photo_url,
                    agents: data.stats
                });
            })
            .catch(err => console.error("Error fetching player:", err));
    }, [id]);

    if (!player) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading Player...</div>;

    return (
        <>
            <Navbar />
            <div className="profile-page-container">
                <div className="profile-header-card player-header">
                    <div className="player-photo-box">
                        <img src={player.photo} alt={player.name} className="p-photo" />
                        <img src={player.team_logo} alt="Team" className="p-team-logo" />
                    </div>
                    <div className="profile-title-info">
                        <h1>{player.name}</h1>
                        <span className="player-real-name">{player.realName}</span>
                        <div className="player-country">
                            <span className="roster-flag">🇮🇩</span> {player.country}
                        </div>
                    </div>
                </div>

                <h2 className="section-title">Agents</h2>

                <div className="agents-table-container">
                    <table className="agents-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>USE</th>
                                <th>RND</th>
                                <th>RATING</th>
                                <th>ACS</th>
                                <th>K:D</th>
                                <th>ADR</th>
                                <th>KAST</th>
                                <th>KPR</th>
                                <th>APR</th>
                                <th>FKPR</th>
                                <th>FDPR</th>
                                <th>K</th>
                                <th>D</th>
                                <th>A</th>
                                <th>FK</th>
                                <th>FD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {player.agents.map((ag, idx) => (
                                <tr key={idx}>
                                    <td className="agent-img-td">
                                        <img src={ag.img} alt={ag.name} className="table-agent-icon" />
                                    </td>
                                    <td>{ag.use}</td>
                                    <td>{ag.rnd}</td>
                                    <td className="highlight-stat">{ag.rtg}</td>
                                    <td>{ag.acs}</td>
                                    <td>{ag.kd}</td>
                                    <td>{ag.adr}</td>
                                    <td>{ag.kast}</td>
                                    <td>{ag.kpr}</td>
                                    <td>{ag.apr}</td>
                                    <td>{ag.fkpr}</td>
                                    <td>{ag.fdpr}</td>
                                    <td>{ag.k}</td>
                                    <td>{ag.d}</td>
                                    <td>{ag.a}</td>
                                    <td>{ag.fk}</td>
                                    <td>{ag.fd}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
