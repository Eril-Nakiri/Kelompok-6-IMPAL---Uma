import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NewsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const res = await fetch(`/api/news/${id}`);
                const result = await res.json();
                if (result.status === 'success') {
                    setNews(result.data);
                } else {
                    alert('Berita tidak ditemukan');
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error("Gagal mengambil detail berita:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id, navigate]);

    if (loading) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2f', paddingTop: '100px', textAlign: 'center', color: 'white' }}>Memuat berita...</div>;
    }

    if (!news) return null;

    return (
        <div style={{ backgroundColor: '#1e1e2f', minHeight: '100vh', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
            <Navbar />

            <div style={{ paddingTop: '90px', paddingBottom: '50px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#2b2b40', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>

                    {news.thumbnail_url && (
                        <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                            <img
                                src={news.thumbnail_url}
                                alt={news.judul}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    <div style={{ padding: '40px' }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{ background: 'transparent', border: 'none', color: '#ff4654', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', padding: '0' }}
                        >
                            🔙 Kembali ke Dashboard
                        </button>

                        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', lineHeight: '1.2' }}>{news.judul}</h1>

                        <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #3a3a5a' }}>
                            Ditulis oleh <strong style={{color: 'white'}}>{news.publisher}</strong> • {new Date(news.tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                        </div>

                        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                            {news.isi_berita}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
