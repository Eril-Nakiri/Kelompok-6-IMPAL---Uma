import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

export default function DashboardAdmin() {
    const navigate = useNavigate();

    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);

    const [formData, setFormData] = useState({
        nama_turnamen: '',
        penyelenggara: ''
    });

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
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
                alert('⚠️ Turnamen ini belum memiliki pertandingan. Anda diarahkan ke halaman Input Match untuk membuatnya terlebih dahulu.');
                navigate('/input-match', { state: { tournament: selectedTournament } });
            } else {
                navigate('/input-match-result', { state: { tournament: selectedTournament } });
            }
        } else if (moduleName === 'Input Match') {
            navigate('/input-match', { state: { tournament: selectedTournament } });
        }
    };

    const handleDeleteTournament = async () => {
        const isConfirm = window.confirm(`⚠️ Yakin ingin menghapus turnamen ${selectedTournament.nama_turnamen}? Semua match di dalamnya mungkin akan ikut terhapus!`);
        if (!isConfirm) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/tournament/${selectedTournament.id_tournament}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert('🗑️ Turnamen berhasil dihapus!');
                setIsChoiceModalOpen(false);
                fetchTournaments();
            } else {
                const result = await response.json();
                alert(`Gagal menghapus: ${result.message || 'Kesalahan server'}`);
            }
        } catch (error) {
            console.error("Error Delete Data:", error);
            alert('Gagal terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
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
                                                <td style={{ fontWeight: 'bold', color: '#10B981' }}>#{tournament.id_tournament}</td>
                                                <td><div style={{ fontWeight: '600', color: '#FFF' }}>{tournament.nama_turnamen}</div></td>
                                                <td style={{ color: '#CBD5E1' }}>{tournament.penyelenggara}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button className="manage-btn" onClick={() => handleSelectTournament(tournament)}>
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

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Buat Turnamen Baru</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>Nama Turnamen</label>
                                <input type="text" name="nama_turnamen" value={formData.nama_turnamen} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Nama Penyelenggara</label>
                                <input type="text" name="penyelenggara" value={formData.penyelenggara} onChange={handleInputChange} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                                <button type="submit" className="action-btn" disabled={isLoading}>{isLoading ? 'Menyimpan...' : 'Simpan ke Database'}</button>
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
                            Anda memilih <strong style={{ color: '#10B981' }}>{selectedTournament.nama_turnamen}</strong>.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="action-btn" onClick={() => handleNavigateToModule('Input Match')}>Input Match (Jadwal)</button>
                            <button className="action-btn" style={{ backgroundColor: '#3B82F6' }} onClick={() => handleNavigateToModule('Input Matches Result')}>Input Matches Result</button>
                            <button className="action-btn delete-btn" onClick={handleDeleteTournament}>Hapus Turnamen</button>
                        </div>
                        <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
                            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setIsChoiceModalOpen(false)}>Kembali</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
