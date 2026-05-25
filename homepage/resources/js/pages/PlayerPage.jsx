import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PlayerPage() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        // TODO: Sambungkan ke API aslimu (contoh: fetch(`${API_URL}/api/players/${id}`))
        // Sementara kita pakai Mock Data untuk menyesuaikan desain Figma
        setPlayer({
            id: id,
            name: "f0rsakeN",
            realName: "Jason Susanto",
            country: "Indonesia",
            photo: "https://owcdn.net/img/603c4672e6189.png",
            team_logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Paper_Rex_logo.svg/1200px-Paper_Rex_logo.svg.png",
            agents: [
                { name: "Omen", img: "https://owcdn.net/img/603cabcfa38d7.png", use: "(16) 59%", rnd: 339, rtg: "0.98", acs: 201.5, kd: "1.02", adr: 131.4, kast: "76%", kpr: 0.72, apr: 0.40, fkpr: 0.11, fdpr: 0.08, k: 245, d: 241, a: 136, fk: 36, fd: 26 },
                { name: "Neon", img: "https://owcdn.net/img/61e89bd402e4d.png", use: "(6) 22%", rnd: 119, rtg: "1.10", acs: 241.5, kd: "1.20", adr: 156.2, kast: "71%", kpr: 0.87, apr: 0.25, fkpr: 0.13, fdpr: 0.14, k: 103, d: 86, a: 30, fk: 15, fd: 17 },
                { name: "Astra", img: "https://owcdn.net/img/603cb0673322d.png", use: "(3) 11%", rnd: 62, rtg: "1.22", acs: 229.0, kd: "1.19", adr: 147.8, kast: "77%", kpr: 0.82, apr: 0.47, fkpr: 0.05, fdpr: 0.05, k: 51, d: 43, a: 29, fk: 3, fd: 3 },
                { name: "Brimstone", img: "https://owcdn.net/img/603cac51410d5.png", use: "(2) 7%", rnd: 44, rtg: "1.04", acs: 161.0, kd: "0.92", adr: 114.1, kast: "82%", kpr: 0.55, apr: 0.61, fkpr: 0.02, fdpr: 0.05, k: 24, d: 26, a: 27, fk: 1, fd: 2 },
            ]
        });
    }, [id]);

    if (!player) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading Player...</div>;

    return (
        <>
            <Navbar />
            <div className="profile-page-container">
                {/* HEADER PEMAIN */}
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

                {/* TABEL AGENT */}
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
