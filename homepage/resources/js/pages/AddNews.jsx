import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

export default function AddNews() {
    const navigate = useNavigate();

    const [judul, setJudul] = useState('');
    const [isiBerita, setIsiBerita] = useState('');
    const [publisher, setPublisher] = useState('Admin VLR');
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <header className="db-header">
                <div className="header-title">
                    <h1>Tambah News Baru</h1>
                    <p>Masukkan informasi berita terbaru untuk ditampilkan di dashboard portal.</p>
                </div>
            </header>

            <div className="db-body">
                <div className="panel-box" style={{ maxWidth: '800px' }}>
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Judul Berita</label>
                            <input
                                type="text" required
                                value={judul} onChange={(e) => setJudul(e.target.value)}
                                placeholder="Masukkan judul..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Nama Publisher</label>
                                <input
                                    type="text" required
                                    value={publisher} onChange={(e) => setPublisher(e.target.value)}
                                />
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Tanggal Terbit</label>
                                <input
                                    type="date" required
                                    value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Thumbnail URL (Tautan Gambar)</label>
                            <input
                                type="url"
                                value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                                placeholder="Contoh: https://images.unsplash.com/foto.jpg"
                            />
                        </div>

                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#0F172A', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
                            <input
                                type="checkbox"
                                id="featuredCheck"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer', margin: 0 }}
                            />
                            <label htmlFor="featuredCheck" style={{ margin: 0, cursor: 'pointer', color: '#10B981', fontSize: '14px' }}>
                                ⭐ Jadikan sebagai Featured News (Berita Utama Thumbnail Besar)
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Isi Lengkap Berita</label>
                            <textarea
                                rows="10" required
                                value={isiBerita} onChange={(e) => setIsiBerita(e.target.value)}
                                placeholder="Tulis paragraf berita di sini..."
                            />
                        </div>

                        <div className="modal-actions" style={{ borderTop: '1px solid #334155', paddingTop: '20px', marginTop: '30px' }}>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/news')}>
                                Batal
                            </button>
                            <button type="submit" className="action-btn" disabled={isLoading}>
                                {isLoading ? 'Menyimpan...' : '🚀 Terbitkan Berita'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
