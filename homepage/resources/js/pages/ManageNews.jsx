import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

export default function ManageNews() {
    const navigate = useNavigate();
    const [newsList, setNewsList] = useState([]);

    const fetchNews = async () => {
        try {
            const res = await fetch('/api/admin/news');
            const result = await res.json();
            if (result.status === 'success') {
                setNewsList(result.data);
            }
        } catch (err) {
            console.error("Gagal mengambil data berita:", err);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini secara permanen?")) return;

        try {
            const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("🗑️ Berita berhasil dihapus!");
                fetchNews();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <header className="db-header">
                <div className="header-title">
                    <h1>Manage News</h1>
                    <p>Kelola daftar berita, tambah, edit, atau hapus konten berita portal.</p>
                </div>
                <div className="header-actions">
                    <button className="action-btn" onClick={() => navigate('/admin/news/add')}>
                        ＋ Tambah News Baru
                    </button>
                </div>
            </header>

            <div className="db-body">
                <div className="panel-box">
                    <div className="panel-header">
                        <div>
                            <h3>Daftar Berita Aktif</h3>
                            <p>Menampilkan seluruh data dari tabel database news.</p>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Judul Berita</th>
                                    <th style={{ width: '20%' }}>Publisher</th>
                                    <th style={{ width: '15%' }}>Tanggal</th>
                                    <th style={{ width: '10%' }}>Featured?</th>
                                    <th style={{ textAlign: 'right', width: '15%' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748B', padding: '32px 0' }}>
                                            Belum ada data berita di database. Silakan tambah baru!
                                        </td>
                                    </tr>
                                ) : (
                                    newsList.map(news => (
                                        <tr key={news.id_news}>
                                            <td style={{ fontWeight: '600', color: '#FFF' }}>{news.judul}</td>

                                            <td style={{ color: '#CBD5E1' }}>{news.publisher}</td>

                                            <td style={{ color: '#CBD5E1' }}>{new Date(news.tanggal).toLocaleDateString('id-ID')}</td>

                                            <td style={{ color: news.featured ? '#10B981' : '#64748B', fontWeight: 'bold' }}>
                                                {news.featured ? '⭐ Yes' : 'No'}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button
                                                        className="manage-btn"
                                                        onClick={() => navigate(`/admin/news/edit/${news.id_news}`)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="manage-btn delete"
                                                        onClick={() => handleDelete(news.id_news)}
                                                    >
                                                        🗑️ Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
