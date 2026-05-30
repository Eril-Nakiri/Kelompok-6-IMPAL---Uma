import React, { useState, useEffect } from 'react';
import '../../css/DashboardAdmin.css';

export default function DashboardAdmin() {
    // State untuk menampung daftar turnamen dari database pgsql
    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // State Kontrol Modal Popup Inputan
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Inputan Form "Buat Turnamen"
    const [formData, setFormData] = useState({
        nama_turnamen: '',
        penyelenggara: ''
    });

    // 1. FUNGSI AMBIL DAFTAR TURNAMEN DARI DATABASE (GET)
    const fetchTournaments = async () => {
        try {
            const response = await fetch('/api/tournament');
            const data = await response.json();
            // Menampung data response dari Laravel
            setTournaments(data.data || data || []);
        } catch (error) {
            console.error("Gagal mengambil data turnamen dari database:", error);
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    // 2. FUNGSI HANDLE INPUT CHANGE
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 3. FUNGSI KIRIM INPUTAN TURNAMEN BARU (POST)
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
                setIsModalOpen(false); // Tutup popup modal
                setFormData({ nama_turnamen: '', penyelenggara: '' }); // Reset form
                fetchTournaments(); // Refresh tabel agar turnamen baru langsung muncul
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

    // Fungsi simulasi ketika admin memilih turnamen yang sudah ada
    const handleSelectTournament = (id, name) => {
        alert(`Anda memilih Turnamen: ${name} (ID: ${id}) untuk dikelola.`);
        // Di sini nantinya Anda bisa mengarahkan halaman atau nge-set active tournament ID
    };

    // Navigasi Menu Baru sesuai request Anda
    const menuItems = [
        { name: 'Dashboard Overview', icon: '📊', active: true },
        { name: 'Manage News', icon: '📰', active: false },
        { name: 'Input Match', icon: '⚔️', active: false },
        { name: 'Input Matches Result', icon: '🏆', active: false },
    ];

    return (
        <div className="db-container">

            {/* SIDEBAR NAVIGASI (KIRI LAYAR) */}
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

            {/* AREA MAIN CONTENT */}
            <main className="db-main">
                <header className="db-header">
                    <div className="header-title">
                        <h1>Dashboard Overview</h1>
                        <p>Silakan pilih turnamen yang tersedia atau buat turnamen baru untuk memulai pengaturan data.</p>
                    </div>
                    <div className="header-actions">
                        <button style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>🔔</button>
                        <button className="action-btn" onClick={() => setIsModalOpen(true)}>＋ Tambah Turnamen Baru</button>
                    </div>
                </header>

                <div className="db-body">
                    <div className="panel-grid" style={{ gridTemplateColumns: '1fr' }}>

                        {/* TABEL DAFTAR TURNAMEN UTAMA */}
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
                                                            onClick={() => handleSelectTournament(tournament.id_tournament, tournament.nama_turnamen)}
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

            {/* POPUP MODAL UNTUK INPUT DATA TURNAMEN BARU */}
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

        </div>
    );
}
