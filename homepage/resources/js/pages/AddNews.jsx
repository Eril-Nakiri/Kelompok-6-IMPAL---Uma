import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../../css/Forum.css';

export default function AddNews() {
    const navigate = useNavigate();

    const [judul, setJudul] = useState('');
    const [isiBerita, setIsiBerita] = useState('');
    const [publisher, setPublisher] = useState('Admin VLR');
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]); // Default hari ini
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/admin/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    judul: judul,
                    isi_berita: isiBerita,
                    publisher: publisher,
                    tanggal: tanggal,
                    featured: isFeatured,
                    thumbnail_url: thumbnailUrl
                })
            });

            const result = await res.json();

            if (res.ok && result.status === 'success') {
                alert('🎉 Berita baru sukses ditambahkan!');
                navigate('/admin/news');
            } else {
                alert(`Gagal: ${result.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan sistem saat menghubungi backend.");
        }
    };

    return (
        <div style={{ backgroundColor: '#1e1e2f', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ paddingTop: '100px', paddingBottom: '50px' }}>
                <div className="mr-container">
                    <header className="mr-header">
                        <h2>Tambah News Baru</h2>
                        <p className="sub-text">Masukkan informasi berita terbaru untuk ditampilkan di dashboard.</p>
                    </header>

                    <form className="mr-form-card" style={{ marginTop: '24px' }} onSubmit={handleSubmit}>

                        <div className="forum-form-group">
                            <label>Judul Berita</label>
                            <input
                                type="text" className="forum-input" required
                                value={judul} onChange={(e) => setJudul(e.target.value)}
                                placeholder="Masukkan judul..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="forum-form-group" style={{ flex: 1 }}>
                                <label>Nama Publisher</label>
                                <input
                                    type="text" className="forum-input" required
                                    value={publisher} onChange={(e) => setPublisher(e.target.value)}
                                />
                            </div>

                            <div className="forum-form-group" style={{ flex: 1 }}>
                                <label>Tanggal Terbit</label>
                                <input
                                    type="date" className="forum-input" required
                                    value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="forum-form-group">
                            <label>Thumbnail URL (Tautan Gambar)</label>
                            <input
                                type="url" className="forum-input"
                                value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                                placeholder="Contoh: https://images.unsplash.com/foto.jpg"
                            />
                        </div>

                        <div className="forum-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="featuredCheck"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="featuredCheck" style={{ margin: 0, cursor: 'pointer', color: '#10B981' }}>
                                ⭐ Jadikan sebagai Featured News (Berita Utama Thumbnail Besar)
                            </label>
                        </div>

                        <div className="forum-form-group">
                            <label>Isi Lengkap Berita</label>
                            <textarea
                                className="forum-textarea" rows="10" required
                                value={isiBerita} onChange={(e) => setIsiBerita(e.target.value)}
                                placeholder="Tulis paragraf berita di sini..."
                            />
                        </div>

                        <div className="forum-btn-group" style={{ marginTop: '30px' }}>
                            <button type="button" className="forum-btn forum-btn-secondary" onClick={() => navigate('/admin/news')}>
                                Batal
                            </button>
                            <button type="submit" className="forum-btn forum-btn-primary">
                                🚀 Terbitkan Berita
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
