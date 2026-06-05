import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../../css/Forum.css';

export default function ForumDashboard() {
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);

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

    return (
        <>
            <Navbar />

            <div className="mr-container forum-navbar-spacer">
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
                                    <th>Dibuat Pada</th>
                                    <th style={{ textAlign: 'right' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {threads.map(thread => (
                                    <tr key={thread.id_thread}>
                                        <td className="thread-title-cell">{thread.title}</td>
                                        <td className="thread-date-cell">{formatDate(thread.created_at)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                className="forum-btn forum-btn-primary"
                                                onClick={() => navigate(`/forum/thread/${thread.id_thread}`)}
                                            >
                                                Lihat Diskusi ➔
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="forum-empty-state">Belum ada thread yang dibuat. Jadilah yang pertama!</p>
                    )}
                </div>
            </div>
        </>
    );
}
