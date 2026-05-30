import React, { useState, useEffect } from 'react';
import '../../css/DashboardAdmin.css';

export default function DashboardAdmin() {

    const [stats, setStats] = useState({ totalTournaments: 0, activeMatches: 0, totalTeams: 0, totalUsers: 0 });
    const [recentMatches, setRecentMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        nama_turnamen: '',
        penyelenggara: ''
    });

    const fetchDataDashboard = async () => {
        try {
            const resMatches = await fetch('/api/matches');
            const dataMatches = await resMatches.json();
            setRecentMatches(dataMatches.data || dataMatches || []);

            const resStats = await fetch('/api/dashboard-stats');
            if (resStats.ok) {
                const dataStats = await resStats.json();
                if (dataStats.success) {
                    setStats(dataStats.data);
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data dari database Railway:", error);
        }
    };

    useEffect(() => {
        fetchDataDashboard();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/tournament', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok || result.status === 'success') {
                alert('🎉 Turnamen baru berhasil disimpan ke database Railway!');
                setIsModalOpen(false);
                setFormData({ nama_turnamen: '', penyelenggara: '' });
                fetchDataDashboard();
            } else {
                alert('Gagal menyimpan data: ' + (result.message || 'Terjadi kesalahan sistem.'));
            }
        } catch (error) {
            console.error("Error Post Data:", error);
            alert('Gagal terhubung ke server Railway. Pastikan Backend Laravel Anda menyala.');
        } finally {
            setIsLoading(false);
        }
    };

    const menuItems = [
        { name: 'Overview', icon: '📊', active: true },
        { name: 'Tournaments', icon: '🏆', active: false },
        { name: 'Teams', icon: '👥', active: false },
        { name: 'Matches', icon: '⚔️', active: false },
        { name: 'Players', icon: '🎮', active: false },
        { name: 'Users', icon: '👤', active: false },
        { name: 'Settings', icon: '⚙️', active: false },
    ];

    return (
        <div className="db-container">
            {/* Sidebar */}
            <aside className="db-sidebar">
                <div>
                    <div className="sidebar-brand">
                        <span className="brand-icon">⚔️</span>
                        <span>META Portal</span>
                    </div>
                    <nav className="sidebar-menu">
                        {menuItems.map((item, index) => (
                            <button key={index} className={`menu-btn ${item.active ? 'active' : ''}`}>
                                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-profile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="profile-avatar">FX</div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#FFF' }}>Felix</p>
                            <p style={{ fontSize: '12px', color: '#10B981', margin: '2px 0 0 0', fontWeight: '500' }}>Super Admin</p>
                        </div>
                    </div>
                    <button className="logout-btn" title="Keluar Log">🚪</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="db-main">
                <header className="db-header">
                    <div className="header-title">
                        <h1>Overview</h1>
                        <p>Selamat datang kembali, roda kendali ada di tangan Anda.</p>
                    </div>
                    <div className="header-actions">
                        <button style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>🔔</button>
                        <button className="action-btn" onClick={() => setIsModalOpen(true)}>＋ Buat Turnamen</button>
                    </div>
                </header>

                <div className="db-body">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">Total Tournaments</div>
                            <div className="stat-value">{stats.totalTournaments}<span className="stat-badge badge-live">📈 Live</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Active Matches</div>
                            <div className="stat-value">{stats.activeMatches}<span className="stat-badge badge-pulse">🎮 Live Now</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total Teams</div>
                            <div className="stat-value">{stats.totalTeams}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total Users</div>
                            <div className="stat-value">{stats.totalUsers}</div>
                        </div>
                    </div>

                    <div className="panel-grid">
                        <div className="panel-box">
                            <div className="panel-header">
                                <h3>Recent Matches</h3>
                                <p>Pantau jalannya pertandingan dari database pgsql.</p>
                            </div>
                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Match Details</th>
                                            <th style={{ textAlign: 'center' }}>Format</th>
                                            <th style={{ textAlign: 'center' }}>Score</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentMatches.length === 0 ? (
                                            <tr><td colSpan="5" style={{ textAlign: 'center', color: '#64748B', padding: '24px 0' }}>Tidak ada pertandingan aktif saat ini.</td></tr>
                                        ) : (
                                            recentMatches.map((match) => (
                                                <tr key={match.id_match || match.id}>
                                                    <td>
                                                        <div className="match-teams">{match.nama_tim_a || 'Team A'} <span className="match-vs">vs</span> {match.nama_tim_b || 'Team B'}</div>
                                                        <div className="match-sub">{match.nama_turnamen || 'Turnamen Bebas'}</div>
                                                    </td>
                                                    <td style={{ textAlign: 'center', color: '#CBD5E1' }}>{match.match_format || 'BO3'}</td>
                                                    <td style={{ textAlign: 'center' }} className="match-score">{match.skor_akhir_a ?? 0} - {match.skor_akhir_b ?? 0}</td>
                                                    <td><span className="status-pill status-ongoing">Active</span></td>
                                                    <td style={{ textAlign: 'right' }}><button className="manage-btn">⚙️ Manage</button></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="panel-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div className="panel-header">
                                    <h3>Quick Actions</h3>
                                    <p>Pintasan kontrol cepat berkas.</p>
                                </div>
                                <div className="action-list">
                                    <button className="action-item" onClick={() => setIsModalOpen(true)}>
                                        <div className="action-text">
                                            <p>Tambah Turnamen</p>
                                            <span>Simpan berkas turnamen baru</span>
                                        </div>
                                        <span>🏆</span>
                                    </button>
                                </div>
                            </div>
                            <div className="info-box">💡 Seluruh aksi input terekam langsung di Database PostgreSQL Anda.</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal Tambah Turnamen */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Buat Turnamen Baru</h3>
                        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '-8px', marginBottom: '20px' }}>
                            Data ini akan langsung di-push ke tabel "tournament" di Railway.
                        </p>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>Nama Turnamen</label>
                                <input type="text" name="nama_turnamen" value={formData.nama_turnamen} onChange={handleInputChange} placeholder="Contoh: MPL ID Season 14" required />
                            </div>
                            <div className="form-group">
                                <label>Nama Penyelenggara</label>
                                <input type="text" name="penyelenggara" value={formData.penyelenggara} onChange={handleInputChange} placeholder="Contoh: Moonton Indonesia" required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                                <button type="submit" className="action-btn" disabled={isLoading}>
                                    {isLoading ? 'Menyimpan...' : 'Simpan ke Database'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
