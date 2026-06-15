import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

export default function EditNews() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [judul, setJudul] = useState('');
    const [isiBerita, setIsiBerita] = useState('');
    const [publisher, setPublisher] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const res = await fetch(`/api/news/${id}`);
                const result = await res.json();

                if (result.status === 'success' && result.data) {
                    const data = result.data;
                    setJudul(data.judul || '');
                    setIsiBerita(data.isi_berita || '');
                    setPublisher(data.publisher || '');
                    if (data.tanggal) {
                        setTanggal(new Date(data.tanggal).toISOString().split('T')[0]);
                    }
                    setThumbnailUrl(data.thumbnail_url || '');
                    setIsFeatured(data.featured ? true : false);
                } else {
                    alert('Berita tidak ditemukan!');
                    navigate('/admin/news');
                }
            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchNewsDetail();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/admin/news/${id}`, {
                method: 'PUT',
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
                alert('✅ Berita berhasil diperbarui!');
                navigate('/admin/news');
            } else {
                alert(`Gagal mengupdate: ${result.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menghubungi server.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <AdminLayout><div style={{ padding: '40px', color: 'white' }}>Memuat data berita...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <header className="db-header">
                <div className="header-title">
                    <h1>Edit News (ID: {id})</h1>
                </div>
            </header>

            <div className="db-body">
                <div className="panel-box">
                    <form onSubmit={handleUpdate} className="form-container-full">

                        <div className="form-group">
                            <label>Judul Berita</label>
                            <input
                                type="text" required
                                value={judul} onChange={(e) => setJudul(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Publisher</label>
                                <input
                                    type="text" required
                                    value={publisher} onChange={(e) => setPublisher(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tanggal Terbit</label>
                                <input
                                    type="date" required
                                    value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Isi Lengkap Berita</label>
                            <textarea
                                required
                                value={isiBerita} onChange={(e) => setIsiBerita(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <input
                                type="checkbox"
                                id="featuredCheck"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                style={{ width: '18px', height: '18px', margin: '0', padding: '0', cursor: 'pointer' }}
                            />
                            <label htmlFor="featuredCheck" style={{ marginLeft: '10px', cursor: 'pointer', color: '#10B981', fontSize: '14px', fontWeight: 'bold', marginBottom: '0' }}>
                                Jadikan sebagai Featured News (Muncul Besar di Dashboard)
                            </label>
                        </div>

                        <div style={{ backgroundColor: '#1E293B', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #3B82F6', fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6' }}>
                            <strong>Info Upload Gambar:</strong><br />
                            Untuk upload gambar, silahkan upload ke ImgBB.com terlebih dahulu untuk mendapatkan link format gambar (contoh : <em style={{ color: '#94A3B8' }}>https://i.ibb.co.com/f7V4C45/IMG-20240530-164327-1.png</em>).<br />
                            Berikut adalah link menuju website tersebut : <a href="https://id.imgbb.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 'bold' }}>https://id.imgbb.com/</a>
                        </div>

                        <div className="form-group">
                            <label>Thumbnail URL (Paste Direct Link dari ImgBB / Postimages di sini)</label>
                            <input
                                type="url"
                                value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                                placeholder="Contoh: https://i.ibb.co.com/gambar-anda.png"
                            />
                            {thumbnailUrl && (
                                <div style={{ marginTop: '10px' }}>
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Preview Gambar:</span><br/>
                                    <img src={thumbnailUrl} alt="Preview" style={{ height: '100px', borderRadius: '6px', marginTop: '6px', border: '1px solid #334155' }} />
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/news')}>
                                Batal
                            </button>
                            <button type="submit" className="action-btn" disabled={isLoading} style={{ backgroundColor: '#3b82f6' }}>
                                {isLoading ? 'Menyimpan...' : '💾 Simpan Perubahan'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
