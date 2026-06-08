import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../../css/MatchesPage.css';

export default function MatchesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('UPCOMING'); // UPCOMING atau RESULTS
    const [matches, setMatches] = useState([]);
    const [teamsMap, setTeamsMap] = useState({});
    const [tournamentsMap, setTournamentsMap] = useState({});

    const resolveMediaUrl = (url) => {
        if (!url) return "https://via.placeholder.com/32";
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || "https://kelompok6uma-impal.up.railway.app"}/${url}`;
    };

    useEffect(() => {
        fetch("/api/teams")
            .then((res) => res.json())
            .then((resData) => {
                const arr = Array.isArray(resData) ? resData : (resData.data || []);
                const map = {};
                arr.forEach(t => { map[t.id_team] = t; });
                setTeamsMap(map);
            }).catch(err => console.error(err));

        fetch("/api/tournament")
            .then((res) => res.json())
            .then((resData) => {
                const arr = Array.isArray(resData) ? resData : (resData.data || []);
                const map = {};
                arr.forEach(t => { map[t.id_tournament] = t; });
                setTournamentsMap(map);
            }).catch(err => console.error(err));

        fetch("/api/matches")
            .then((res) => res.json())
            .then((resData) => {
                setMatches(Array.isArray(resData) ? resData : (resData.data || []));
            }).catch(err => console.error(err));
    }, []);

    const now = new Date();

    const filteredMatches = matches.filter(match => {
        if (!match.jadwal) return activeTab === 'UPCOMING';
        const isPast = new Date(match.jadwal) < now;
        return activeTab === 'UPCOMING' ? !isPast : isPast;
    });

    return (
        <div style={{ backgroundColor: '#1e1e2f', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '100px', paddingBottom: '50px' }}>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #3a3a5a', paddingBottom: '12px' }}>
                    <button
                        onClick={() => setActiveTab('UPCOMING')}
                        style={{ background: activeTab === 'UPCOMING' ? '#ff4654' : 'transparent', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Upcoming Matches
                    </button>
                    <button
                        onClick={() => setActiveTab('RESULTS')}
                        style={{ background: activeTab === 'RESULTS' ? '#10b981' : 'transparent', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Match Results
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredMatches.length > 0 ? (
                        filteredMatches.map((match) => {
                            const teamA = teamsMap[match.id_team_a];
                            const teamB = teamsMap[match.id_team_b];
                            const tournament = tournamentsMap[match.id_tournament];

                            return (
                                <div
                                    key={match.id_match}
                                    onClick={() => navigate(`/matches/${match.id_match}`)}
                                    style={{ background: 'linear-gradient(135deg, #2b2b40, #1c1c2e)', padding: '20px', borderRadius: '12px', border: '1px solid #3a3a5a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: '0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff4654'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3a3a5a'}
                                >
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold', marginBottom: '6px' }}>
                                            🏆 {tournament?.nama_turnamen || "Tournament VCT"}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <img src={resolveMediaUrl(teamA?.logo_url)} alt="A" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                                                <span style={{ fontWeight: 'bold' }}>{teamA?.nama_tim || "TBD"}</span>
                                            </div>
                                            <span style={{ color: '#ff4654', fontWeight: '900' }}>
                                                {activeTab === 'RESULTS' ? `${match.skor_akhir_a} - ${match.skor_akhir_b}` : 'VS'}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <img src={resolveMediaUrl(teamB?.logo_url)} alt="B" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                                                <span style={{ fontWeight: 'bold' }}>{teamB?.nama_tim || "TBD"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', fontSize: '13px', color: '#94a3b8' }}>
                                        <div>{match.match_format || 'BO3'} Series</div>
                                        <div style={{ marginTop: '4px', color: 'white', fontWeight: '600' }}>
                                            🕒 {new Date(match.jadwal).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })} WIB
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textStyle: 'italic', color: '#64748b', padding: '20px', textAlign: 'center' }}>
                            Tidak ada pertandingan di kategori ini.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
