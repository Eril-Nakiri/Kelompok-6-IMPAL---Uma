import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../../css/Forum.css';

export default function ForumDashboard() {
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);

    const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;
    const currentUserId = currentUser ? parseInt(currentUser.id_user) : null;
    const isAdmin = currentUser && parseInt(currentUser.id_role) === 1;

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const res = await fetch('/api/forum/threads');
                const result = await res.json();
                if (result.status === 'success') {
                    setThreads(result.data);
                }
            } catch (err) {
                console.error("Gagal mengambil data forum:", err);
            }
        };
        fetchThreads();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    const handleDeleteThread = async (id_thread) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus diskusi ini beserta seluruh balasannya?")) return;

        try {
            const res = await fetch(`/api/forum/threads/${id_thread}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_user: currentUserId,
                    id_role: currentUser?.id_role
                })
            });
            const result = await res.json();

            if (result.status === 'success') {
                alert("Diskusi berhasil dihapus!");
                setThreads(threads.filter(t => t.id_thread !== id_thread));
            } else {
                alert(`Gagal menghapus: ${result.message}`);
            }
        } catch (err) {
            alert("Terjadi kesalahan saat menghubungi server");
        }
    };

    return (
        <>
            <Navbar />

            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="mr-container">
                    <header className="mr-header forum-header-flex">
                        <div className="mr-title-area">
                            <h2>Community Forum</h2>
                            <p className="sub-text">Diskusikan meta terbaru, turnamen, dan cari tim di sini!</p>
                        </div>
                        <button
                            className="forum-btn forum-btn-success"
                            onClick={() => navigate('/forum/create')}
                        >
                            ➕ Start New Thread
                        </button>
                    </header>

                    <div className="mr-form-card" style={{ marginTop: '24px' }}>
                        {threads.length > 0 ? (
                            <table className="forum-table">
                                <thead>
                                    <tr>
                                        <th>Topik (Title)</th>
                                        <th>Pembuat</th>
                                        <th>Dibuat Pada</th>
                                        <th style={{ textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {threads.map(thread => {
                                        const canDelete = isAdmin || (currentUserId === parseInt(thread.id_user));

                                        return (
                                            <tr key={thread.id_thread}>
                                                <td className="thread-title-cell">
                                                    <strong>{thread.title}</strong>
                                                </td>
                                                <td className="thread-author-cell" style={{ color: '#00E1D9' }}>
                                                    👤 {thread.username || `User ${thread.id_user}`}
                                                </td>
                                                <td className="thread-date-cell">{formatDate(thread.created_at)}</td>

                                                <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button
                                                        className="forum-btn forum-btn-primary"
                                                        onClick={() => navigate(`/forum/thread/${thread.id_thread}`)}
                                                    >
                                                        Lihat Diskusi ➔
                                                    </button>

                                                    {canDelete && (
                                                        <button
                                                            className="forum-btn"
                                                            style={{ backgroundColor: '#ff4654', color: 'white' }}
                                                            onClick={() => handleDeleteThread(thread.id_thread)}
                                                        >
                                                            🗑️ Hapus
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p className="forum-empty-state">Belum ada thread yang dibuat. Jadilah yang pertama!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
