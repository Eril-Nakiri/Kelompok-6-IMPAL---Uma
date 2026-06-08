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
                    judul, isi_berita: isiBerita, publisher, tanggal, featured: isFeatured, thumbnail_url: thumbnailUrl
                })
            });

            const result = await res.json();
            if (res.ok && result.status === 'success') {
                alert('🎉 Berita berhasil ditambahkan!');
                navigate('/admin/news');
            } else {
                alert(`Gagal: ${result.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <header className="db-header">
                <div className="header-title">
                    <h1>Tambah News Baru</h1>
                </div>
            </header>

            <div className="db-body">
                <div className="panel-box form-container-full">
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Judul Berita</label>
                            <input
                                type="text" required
                                value={judul} onChange={(e) => setJudul(e.target.value)}
                                placeholder="Masukkan judul..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Publisher</label>
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
                            <label>Thumbnail URL</label>
                            <input
                                type="url"
                                value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                                    style={{ width: 'auto', margin: 0 }}
                                />
                                ⭐ Jadikan sebagai Featured News
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Isi Lengkap Berita</label>
                            <textarea
                                required
                                value={isiBerita} onChange={(e) => setIsiBerita(e.target.value)}
                                placeholder="Tuliskan isi berita..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
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
