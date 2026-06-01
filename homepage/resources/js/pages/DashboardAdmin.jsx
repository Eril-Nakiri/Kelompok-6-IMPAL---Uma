import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/DashboardAdmin.css';

export default function DashboardAdmin() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ username: 'Loading...', email: 'Loading...' });

    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);

    const [selectedTournament, setSelectedTournament] = useState(null);

    const [formData, setFormData] = useState({
        nama_turnamen: '',
        penyelenggara: ''
    });

    const fetchUser = () => {
        try {
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);

                setUser({
                    username: parsedUser.username,
                    email: parsedUser.email
                });
            } else {
                console.warn("Tidak ada data user, mengalihkan ke login...");
                navigate('/login');
            }
        } catch (error) {
            console.error("Gagal membaca data user dari penyimpanan:", error);
            setUser({ username: 'Error', email: 'Data rusak' });
        }
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar dari META Portal?");
        if (!confirmLogout) return;

        localStorage.removeItem('user');

        navigate('/login');
    };

    const fetchTournaments = async () => {
        try {
            const response = await fetch('/api/tournament');
            const data = await response.json();
            setTournaments(data.data || data || []);
        } catch (error) {
            console.error("Gagal mengambil data turnamen dari database:", error);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchTournaments();
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
                alert('🎉 Turnamen baru berhasil disimpan!');
                setIsModalOpen(false);
                setFormData({ nama_turnamen: '', penyelenggara: '' });
                fetchTournaments();
            } else {
                alert('Gagal menyimpan data: ' + (result.message || 'Terjadi kesalahan sistem.'));
            }
        } catch (error) {
            console.error("Error Post Data:", error);
            alert('Gagal terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectTournament = (tournament) => {
        setSelectedTournament(tournament);
        setIsChoiceModalOpen(true);
    };

    const handleNavigateToModule = (moduleName) => {
        setIsChoiceModalOpen(false);

        if (moduleName === 'Input Matches Result') {
            if (!selectedTournament.matches_count || selectedTournament.matches_count === 0) {
                alert('Turnamen ini belum memiliki pertandingan. Anda diarahkan ke halaman Input Match untuk membuatnya terlebih dahulu.');
                navigate('/input-match', { state: { tournament: selectedTournament } });
            } else {
                navigate('/input-match-result', { state: { tournament: selectedTournament } });
            }
        } else if (moduleName === 'Input Match') {
            navigate('/input-match', { state: { tournament: selectedTournament } });
        }
    };

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const menuItems = [
        { name: 'Dashboard Overview', icon: '📊', path: '/dashboard-admin', active: true },
        { name: 'Manage News', icon: '📰', path: '#', active: false },
        { name: 'Input Match', icon: '⚔️', path: '/input-match', active: false },
        { name: 'Input Matches Result', icon: '🏆', path: '/input-match-result', active: false },
    ];

    return (
        <div className="db-container">
            <aside className="db-sidebar">
                <div>
                    <div className="sidebar-brand">
                        <span className="brand-icon">⚔️</span>
                        <span>META Portal</span>
                    </div>
                    <nav className="sidebar-menu">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`menu-btn ${item.active ? 'active' : ''}`}
                                onClick={() => handleMenuClick(item.path)}
                            >
                                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-profile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="profile-avatar">
                            {user.username && user.username !== 'Loading...' ? user.username.substring(0, 2).toUpperCase() : '??'}
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#FFF' }}>{user.username}</p>
                            <p style={{ fontSize: '12px', color: '#10B981', margin: '2px 0 0 0', fontWeight: '500' }}>{user.email}</p>
                        </div>
                    </div>
                    <button className="logout-btn" title="Keluar" onClick={handleLogout}>🚪</button>
                </div>
            </aside>

            <main className="db-main">
                <header className="db-header">
                    <div className="header-title">
                        <h1>Dashboard Overview</h1>
                        <p>Silakan pilih turnamen yang tersedia atau buat turnamen baru untuk memulai pengaturan data.</p>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn" onClick={() => setIsModalOpen(true)}>＋ Tambah Turnamen Baru</button>
                    </div>
                </header>

                <div className="db-body">
                    <div className="panel-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="panel-box">
                            <div className="panel-header">
                                <div>
                                    <h3>Daftar Turnamen Aktif</h3>
                                    <p>Menampilkan seluruh data dari tabel database tournaments.</p>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '15%' }}>ID Tournament</th>
                                            <th style={{ width: '45%' }}>Nama Turnamen</th>
                                            <th style={{ width: '25%' }}>Penyelenggara</th>
                                            <th style={{ textAlign: 'right', width: '15%' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tournaments.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', color: '#64748B', padding: '32px 0' }}>
                                                    Belum ada data turnamen di database. Silakan tambah baru!
                                                </td>
                                            </tr>
                                        ) : (
                                            tournaments.map((tournament) => (
                                                <tr key={tournament.id_tournament}>
                                                    <td style={{ fontWeight: 'bold', color: '#10B981' }}>
                                                        #{tournament.id_tournament}
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: '600', color: '#FFF' }}>
                                                            {tournament.nama_turnamen}
                                                        </div>
                                                    </td>
                                                    <td style={{ color: '#CBD5E1' }}>
                                                        {tournament.penyelenggara}
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button
                                                            className="manage-btn"
                                                            onClick={() => handleSelectTournament(tournament)}
                                                        >
                                                            ➔ Pilih Turnamen
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Buat Turnamen Baru</h3>
                        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '-8px', marginBottom: '20px' }}>
                            Data ini akan langsung dimasukkan ke dalam tabel "tournaments" Anda.
                        </p>

                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>Nama Turnamen</label>
                                <input
                                    type="text"
                                    name="nama_turnamen"
                                    value={formData.nama_turnamen}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: MPL ID Season 14"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Nama Penyelenggara</label>
                                <input
                                    type="text"
                                    name="penyelenggara"
                                    value={formData.penyelenggara}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Moonton Indonesia"
                                    required
                                />
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

            {isChoiceModalOpen && selectedTournament && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚙️</div>
                        <h3 style={{ marginBottom: '6px' }}>Pengaturan Turnamen</h3>
                        <p style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '24px' }}>
                            Anda memilih <strong style={{ color: '#10B981' }}>{selectedTournament.nama_turnamen}</strong>.<br />
                            Silakan pilih aksi yang ingin Anda lakukan:
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                className="action-btn"
                                style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                onClick={() => handleNavigateToModule('Input Match')}
                            > Input Match (Jadwal)
                            </button>

                            <button
                                className="action-btn"
                                style={{ width: '100%', padding: '14px', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                onClick={() => handleNavigateToModule('Input Matches Result')}
                            > Input Matches Result (Hasil Skor)
                            </button>

                            <button
                                className="action-btn"
                                style={{ width: '100%', padding: '14px', backgroundColor: '#EF4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                onClick={handleDeleteTournament}
                            > Hapus Turnamen
                            </button>
                        </div>

                        <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
                            <button
                                className="btn-secondary"
                                style={{ width: '100%' }}
                                onClick={() => setIsChoiceModalOpen(false)}
                            >
                                Kembali ke Overview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
