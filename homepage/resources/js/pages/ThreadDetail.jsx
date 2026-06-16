import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../../css/Forum.css';

export default function ThreadDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [thread, setThread] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');

    const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;
    const currentUserId = currentUser ? parseInt(currentUser.id_user || currentUser.id || 1) : null;
    const isAdmin = currentUser && parseInt(currentUser.id_role) === 1;

    useEffect(() => {
        fetchThreadData();
    }, [id]);

    const fetchThreadData = async () => {
        try {
            const res = await fetch(`/api/forum/threads/${id}`);
            const result = await res.json();
            if (result.status === 'success') {
                setThread(result.data.thread);
                setReplies(result.data.replies);
            }
        } catch (err) {
            console.error("Gagal mengambil thread:", err);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/forum/threads/${id}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    content: replyContent,
                    id_user: currentUserId || 1
                })
            });

            const result = await res.json();
            if (res.ok && result.status === 'success') {
                alert('Balasan berhasil dikirim!');
                setReplyContent('');
                fetchThreadData();
            } else {
                alert(`Gagal mengirim balasan:\n${result.message || 'Terjadi kesalahan'}`);
            }
        } catch (error) {
            alert("Gagal terhubung ke server backend.");
        }
    };

    const handleDeleteReply = async (id_reply) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus balasan Anda ini?")) return;

        try {
            const res = await fetch(`/api/forum/replies/${id_reply}`, {
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
                setReplies(replies.filter(r => r.id_reply !== id_reply));
            } else {
                alert(`Gagal menghapus: ${result.message}`);
            }
        } catch (err) {
            alert("Terjadi kesalahan saat menghubungi server");
        }
    };

    if (!thread) return <div className="mr-container" style={{paddingTop: '100px'}}><p style={{color: 'white'}}>Loading...</p></div>;

    return (
        <>
            <Navbar />

            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="mr-container">
                    <button
                        className="forum-btn forum-btn-secondary thread-back-btn"
                        onClick={() => navigate('/forum')}
                    >
                        🔙 Kembali ke Forum
                    </button>

                    <div className="mr-form-card thread-main-card">
                        <h2 className="thread-title-heading">{thread.title}</h2>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '16px', borderBottom: '1px solid #2a3344', paddingBottom: '12px' }}>
                            <span className="thread-meta-text" style={{ color: '#00E1D9', fontWeight: 'bold' }}>
                                👤 Diposting oleh: {thread.username || `User ${thread.id_user}`}
                            </span>
                            <span className="thread-meta-text">
                                {new Date(thread.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                        </div>
                        <div className="thread-content-text" style={{ whiteSpace: 'pre-wrap' }}>
                            {thread.content}
                        </div>
                    </div>

                    <h3 className="reply-section-title">Balasan ({replies.length})</h3>

                    {replies.length > 0 ? (
                        replies.map((reply, idx) => {
                            const canDeleteReply = isAdmin || (currentUserId === parseInt(reply.id_user));

                            return (
                                <div key={idx} className="mr-form-card thread-reply-card" style={{ padding: '20px', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                        <span className="thread-meta-text" style={{ color: '#00A3FF', fontWeight: 'bold' }}>
                                            ↳ 👤 {reply.username || `User ${reply.id_user}`} membalas:
                                        </span>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span className="thread-meta-text" style={{ fontSize: '12px' }}>
                                                {new Date(reply.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>

                                            {canDeleteReply && (
                                                <button
                                                    onClick={() => handleDeleteReply(reply.id_reply)}
                                                    style={{
                                                        background: '#ff4654', color: 'white', border: 'none',
                                                        padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                                                    }}
                                                    title="Hapus balasan ini"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="thread-reply-content" style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>
                                        {reply.content}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="forum-empty-state" style={{ padding: '0', textAlign: 'left', marginBottom: '24px' }}>
                            Belum ada balasan. Jadilah yang pertama membalas!
                        </p>
                    )}

                    <form className="mr-form-card thread-reply-form" onSubmit={handleReplySubmit}>
                        <h4 className="reply-form-title">Tulis Balasan</h4>
                        <textarea
                            className="forum-textarea"
                            style={{ marginBottom: '16px' }}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Tulis pendapat Anda di sini..."
                            rows="4"
                            required
                        />
                        <button type="submit" className="forum-btn forum-btn-success forum-btn-full">
                            Kirim Balasan
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
