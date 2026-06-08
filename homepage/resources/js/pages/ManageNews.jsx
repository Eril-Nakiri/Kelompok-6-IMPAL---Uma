import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../../css/Forum.css';

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
                alert("Berita berhasil dihapus!");
                fetchNews();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ backgroundColor: '#1e1e2f', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ paddingTop: '100px', paddingBottom: '50px' }}>
                <div className="mr-container">
                    <header className="mr-header forum-header-flex">
                        <div className="mr-title-area">
                            <h2>Manage News (Admin)</h2>
                            <p className="sub-text">Kelola daftar berita, tambah, edit, atau hapus konten.</p>
                        </div>
                        <button
                            className="forum-btn forum-btn-success"
                            onClick={() => navigate('/admin/news/add')}
                        >
                            ➕ Tambah News Baru
                        </button>
                    </header>

                    <div className="mr-form-card" style={{ marginTop: '24px' }}>
                        {newsList.length > 0 ? (
                            <table className="forum-table">
                                <thead>
                                    <tr>
                                        <th>Judul Berita</th>
                                        <th>Publisher</th>
                                        <th>Tanggal</th>
                                        <th>Featured?</th>
                                        <th style={{ textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsList.map(news => (
                                        <tr key={news.id_news}>
                                            <td className="thread-title-cell">{news.judul}</td>
                                            <td style={{ color: '#94a3b8' }}>{news.publisher}</td>
                                            <td className="thread-date-cell">{new Date(news.tanggal).toLocaleDateString('id-ID')}</td>
                                            <td style={{ color: news.featured ? '#10B981' : '#94a3b8', fontWeight: 'bold' }}>
                                                {news.featured ? '⭐ Yes' : 'No'}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div className="forum-btn-group" style={{ justifyContent: 'center' }}>
                                                    <button
                                                        className="forum-btn forum-btn-primary"
                                                        onClick={() => alert("Halaman edit segera menyusul! 😎")}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="forum-btn forum-btn-secondary"
                                                        style={{ backgroundColor: '#EF4444' }}
                                                        onClick={() => handleDelete(news.id_news)}
                                                    >
                                                        🗑️ Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="forum-empty-state">Belum ada berita di database.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
