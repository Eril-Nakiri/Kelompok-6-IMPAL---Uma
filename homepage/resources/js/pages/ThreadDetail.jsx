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

        let finalUserId = 1;
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                finalUserId = parseInt(userData.id_user || userData.id || 1);
            }
        } catch (error) {
            console.error("Gagal memproses data user dari LocalStorage:", error);
        }

        try {
            const res = await fetch(`/api/forum/threads/${id}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    content: replyContent,
                    id_user: finalUserId
                })
            });

            const rawText = await res.text();
            let result;

            try {
                result = JSON.parse(rawText);
            } catch (parseError) {
                alert(`🚨 SERVER ERROR!\nLaravel mengembalikan error berikut:\n\n${rawText.substring(0, 300)}...`);
                return;
            }

            if (res.ok && result.status === 'success') {
                alert('✅ Balasan berhasil dikirim!');
                setReplyContent('');
                fetchThreadData();
            } else {
                alert(`Gagal mengirim balasan:\n${result.message || 'Terjadi kesalahan'}`);
            }
        } catch (error) {
            console.error("Error Fetch:", error);
            alert("Gagal terhubung ke server backend.");
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
                                🕒 {new Date(thread.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                        </div>
                        <div className="thread-content-text" style={{ whiteSpace: 'pre-wrap' }}>
                            {thread.content}
                        </div>
                    </div>

                    <h3 className="reply-section-title">Balasan ({replies.length})</h3>

                    {replies.length > 0 ? (
                        replies.map((reply, idx) => (
                            <div key={idx} className="mr-form-card thread-reply-card" style={{ padding: '20px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span className="thread-meta-text" style={{ color: '#00A3FF', fontWeight: 'bold' }}>
                                        ↳ 👤 {reply.username || `User ${reply.id_user}`} membalas:
                                    </span>
                                    <span className="thread-meta-text" style={{ fontSize: '12px' }}>
                                        {new Date(reply.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                </div>
                                <div className="thread-reply-content" style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>
                                    {reply.content}
                                </div>
                            </div>
                        ))
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
