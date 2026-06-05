import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../../css/Forum.css';

export default function CreateThread() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userStr = localStorage.getItem('user');
        const userData = userStr ? JSON.parse(userStr) : { id_user: 1 };

        try {
            const res = await fetch('/api/forum/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    id_user: userData.id_user || userData.id || 1
                })
            });

            if (res.ok) {
                alert('Thread berhasil dibuat!');
                navigate('/forum');
            } else {
                alert('Gagal membuat thread.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />

            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="mr-container">
                    <header className="mr-header">
                        <h2>Start a New Thread</h2>
                        <p className="sub-text">Buat topik diskusi baru untuk komunitas.</p>
                    </header>

                    <form className="mr-form-card" style={{ marginTop: '24px' }} onSubmit={handleSubmit}>
                        <div className="forum-form-group">
                            <label>Judul (Title)</label>
                            <input
                                type="text"
                                className="forum-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Meta Agent Omen di Map Ascent"
                                required
                            />
                        </div>

                        <div className="forum-form-group">
                            <label>Isi Diskusi (Text)</label>
                            <textarea
                                className="forum-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Tuliskan pendapat atau pertanyaan Anda di sini..."
                                rows="6"
                                required
                            />
                        </div>

                        <div className="forum-btn-group">
                            <button type="button" className="forum-btn forum-btn-secondary" onClick={() => navigate('/forum')}>
                                Batal
                            </button>
                            <button type="submit" className="forum-btn forum-btn-primary">
                                🚀 Posting Thread
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
