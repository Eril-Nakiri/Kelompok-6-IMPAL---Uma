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
            const res = await fetch('/api/forum/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    id_user: finalUserId
                })
            });

            const result = await res.json();

            if (res.ok && result.status === 'success') {
                alert('🎉 Thread berhasil dibuat!');
                navigate('/forum');
            } else {
                alert(`Gagal membuat thread:\n${result.message || 'Kesalahan pada server.'}`);
            }
        } catch (error) {
            console.error("Error Fetch:", error);
            alert("Gagal terhubung ke server backend.");
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
