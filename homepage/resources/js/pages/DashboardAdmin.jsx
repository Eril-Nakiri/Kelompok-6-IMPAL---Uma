import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/DashboardAdmin.css';

export default function DashboardAdmin() {
    const navigate = useNavigate();

    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState({ id: null, name: '' });

    const [formData, setFormData] = useState({ nama_turnamen: '', penyelenggara: '' });

    const fetchTournaments = async () => {
        try {
            const response = await fetch('/api/tournament');
            const data = await response.json();
            setTournaments(data.data || data || []);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };

    useEffect(() => { fetchTournaments(); }, []);

    const handleSelectTournament = (id, name) => {
        setSelectedTournament({ id: id, name: name });
        setIsChoiceModalOpen(true);
    };

    const handleNavigateFromModal = (path) => {
        setIsChoiceModalOpen(false);
        navigate(path, { state: { tournament: selectedTournament } });
    };

    return (
        <div className="db-container">

            <aside className="db-sidebar">
                <div>
                    <div className="sidebar-brand">
                        <span className="brand-icon">⚔️</span>
                        <span>META Portal</span>
                    </div>
                    <nav className="sidebar-menu">
                        <Link to="/admin" className="menu-btn active">
                            <span>📊</span> Dashboard Overview
                        </Link>
                        <Link to="/admin/manage-news" className="menu-btn">
                            <span>📰</span> Manage News
                        </Link>
                        <Link to="/admin/input-match" className="menu-btn">
                            <span>⚔️</span> Input Match
                        </Link>
                        <Link to="/admin/input-match-result" className="menu-btn">
                            <span>🏆</span> Input Matches Result
                        </Link>
                    </nav>
                </div>

                <div className="sidebar-profile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="profile-avatar">FX</div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#FFF' }}>Felix</p>
                            <p style={{ fontSize: '12px', color: '#10B981', margin: '2px 0 0 0' }}>Super Admin</p>
                        </div>
                    </div>
                    <button className="logout-btn">🚪</button>
                </div>
            </aside>

            <main className="db-main">
                <header className="db-header">
                    <div className="header-title">
                        <h1>Dashboard Overview</h1>
                        <p>Silakan pilih turnamen yang tersedia atau buat turnamen baru.</p>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn" onClick={() => setIsModalOpen(true)}>＋ Tambah Turnamen Baru</button>
                    </div>
                </header>

                <div className="db-body">
                    <div className="panel-box">
                        <div className="table-responsive">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>ID Tournament</th>
                                        <th>Nama Turnamen</th>
                                        <th>Penyelenggara</th>
                                        <th style={{ textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tournaments.map((tournament) => (
                                        <tr key={tournament.id_tournament}>
                                            <td style={{ fontWeight: 'bold', color: '#10B981' }}>#{tournament.id_tournament}</td>
                                            <td><div style={{ fontWeight: '600', color: '#FFF' }}>{tournament.nama_turnamen}</div></td>
                                            <td style={{ color: '#CBD5E1' }}>{tournament.penyelenggara}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="manage-btn" onClick={() => handleSelectTournament(tournament.id_tournament, tournament.nama_turnamen)}>
                                                    ➔ Pilih Turnamen
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {isChoiceModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center' }}>
                        <h3>Pengaturan Turnamen</h3>
                        <p style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '24px' }}>
                            Anda memilih <strong style={{ color: '#10B981' }}>{selectedTournament.name}</strong>.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="action-btn" onClick={() => handleNavigateFromModal('/admin/input-match')}>
                                ⚔️ Input Match (Jadwal)
                            </button>
                            <button className="action-btn" style={{ backgroundColor: '#3B82F6' }} onClick={() => handleNavigateFromModal('/admin/input-match-result')}>
                                🏆 Input Matches Result (Hasil Skor)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
