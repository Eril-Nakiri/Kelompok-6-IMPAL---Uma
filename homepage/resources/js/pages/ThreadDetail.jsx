import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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

        const userStr = localStorage.getItem('user');
        const userData = userStr ? JSON.parse(userStr) : { id_user: 1 };

        try {
            const res = await fetch(`/api/forum/threads/${id}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: replyContent,
                    title: `Re: ${thread?.title || 'Thread'}`,
                    id_user: userData.id_user || userData.id || 1
                })
            });

            if (res.ok) {
                setReplyContent('');
                fetchThreadData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!thread) return <div className="mr-container"><p style={{color: 'white'}}>Loading...</p></div>;

    return (
        <div className="mr-container">
            <button
                className="forum-btn forum-btn-secondary thread-back-btn"
                onClick={() => navigate('/forum')}
            >
                🔙 Kembali ke Forum
            </button>

            <div className="mr-form-card thread-main-card">
                <h2 className="thread-title-heading">{thread.title}</h2>
                <span className="thread-meta-text">Dibuat pada: {new Date(thread.created_at).toLocaleString('id-ID')}</span>
                <div className="thread-content-text">
                    {thread.content}
                </div>
            </div>

            <h3 className="reply-section-title">Balasan ({replies.length})</h3>
            {replies.length > 0 ? (
                replies.map((reply, idx) => (
                    <div key={idx} className="mr-form-card thread-reply-card">
                        <span className="thread-meta-text">Dibalas pada: {new Date(reply.created_at).toLocaleString('id-ID')}</span>
                        <div className="thread-reply-content">
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
    );
}
