import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/InputMatch.css';

export default function InputMatch() {
    const location = useLocation();
    const navigate = useNavigate();

    const tournament = location.state?.tournament;

    const [isLoading, setIsLoading] = useState(false);
    const [teams, setTeams] = useState([]);

    const [existingMatches, setExistingMatches] = useState([]);
    const [isLoadingMatches, setIsLoadingMatches] = useState(true);

    const [formData, setFormData] = useState({
        id_tournament: tournament?.id_tournament || '',
        id_team_a: '',
        id_team_b: '',
        match_format: 'BO3 Series',
        jadwal: '',
        skor_akhir_a: 0,
        skor_akhir_b: 0
    });

    useEffect(() => {
        if (!tournament) {
            alert('Akses tidak valid. Silakan pilih turnamen terlebih dahulu dari Dashboard.');
            navigate('/dashboard-admin');
            return;
        }

        const fetchTeams = async () => {
            try {
                const response = await fetch('/api/teams');
                const data = await response.json();
                setTeams(data.data || data || []);
            } catch (error) {
                console.error("Gagal mengambil data tim:", error);
            }
        };

        const fetchMatches = async () => {
            try {
                const response = await fetch('/api/matches');
                const data = await response.json();
                const allMatches = Array.isArray(data) ? data : (data.data || []);

                const filteredMatches = allMatches.filter(m => m.id_tournament === tournament.id_tournament);
                setExistingMatches(filteredMatches);
            } catch (error) {
                console.error("Gagal mengambil data pertandingan:", error);
            } finally {
                setIsLoadingMatches(false);
            }
        };

        fetchTeams();
        fetchMatches();
    }, [tournament, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.id_team_a === formData.id_team_b) {
            alert('Tim A dan Tim B tidak boleh sama!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok || result.status === 'success') {
                alert('🎉 Jadwal pertandingan berhasil dibuat!');
                navigate('/dashboard-admin');
            } else {
                alert('Gagal menyimpan data: ' + (result.message || 'Terjadi kesalahan sistem.'));
            }
        } catch (error) {
            console.error("Error Post Data:", error);
            alert('Gagal terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatWaktu = (jadwal) => {
        const date = new Date(jadwal);
        return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div className="db-container" style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#FFF', padding: '32px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                <div style={{ marginBottom: '24px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px' }}>Input Jadwal Pertandingan</h1>
                        <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
                            Turnamen Aktif: <strong style={{ color: '#10b981' }}>{tournament?.nama_turnamen || 'Belum Memilih Turnamen'}</strong>
                        </p>
                    </div>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '32px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Buat Jadwal Baru</h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>
                        Silakan pilih tim yang akan bertanding dan tentukan jadwalnya. Skor awal akan otomatis diatur menjadi 0.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ marginBottom: '8px', fontSize: '14px' }}>Tim A</label>
                                <select
                                    name="id_team_a"
                                    value={formData.id_team_a}
                                    onChange={handleInputChange}
                                    required
                                    style={{ padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#FFF', borderRadius: '4px' }}
                                >
                                    <option value="">-- Pilih Tim A --</option>
                                    {teams.map(team => (
                                        <option key={team.id_team} value={team.id_team}>{team.nama_tim}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#475569', marginTop: '24px' }}>VS</div>

                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ marginBottom: '8px', fontSize: '14px' }}>Tim B</label>
                                <select
                                    name="id_team_b"
                                    value={formData.id_team_b}
                                    onChange={handleInputChange}
                                    required
                                    style={{ padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#FFF', borderRadius: '4px' }}
                                >
                                    <option value="">-- Pilih Tim B --</option>
                                    {teams.map(team => (
                                        <option key={team.id_team} value={team.id_team}>{team.nama_tim}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ marginBottom: '8px', fontSize: '14px' }}>Format Pertandingan</label>
                                <select
                                    name="match_format"
                                    value={formData.match_format}
                                    onChange={handleInputChange}
                                    style={{ padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#FFF', borderRadius: '4px' }}
                                >
                                    <option value="BO1 Series">BO1 Series</option>
                                    <option value="BO3 Series">BO3 Series</option>
                                    <option value="BO5 Series">BO5 Series</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ marginBottom: '8px', fontSize: '14px' }}>Jadwal Pertandingan</label>
                                <input
                                    type="datetime-local"
                                    name="jadwal"
                                    value={formData.jadwal}
                                    onChange={handleInputChange}
                                    required
                                    style={{ padding: '11px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#FFF', borderRadius: '4px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard-admin')}
                                style={{
                                    backgroundColor: '#475569', color: '#FFF', padding: '12px 24px',
                                    border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    backgroundColor: '#10b981', color: '#FFF', padding: '12px 24px',
                                    border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan Jadwal'}
                            </button>
                        </div>
                    </form>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Jadwal Pertandingan di Turnamen Ini</h3>
                    {isLoadingMatches ? (
                        <p style={{ color: '#94a3b8' }}>Memuat jadwal...</p>
                    ) : existingMatches.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                                        <th style={{ padding: '12px 8px' }}>Jadwal</th>
                                        <th style={{ padding: '12px 8px' }}>Tim A</th>
                                        <th style={{ padding: '12px 8px' }}>Tim B</th>
                                        <th style={{ padding: '12px 8px' }}>Format</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {existingMatches.map(m => (
                                        <tr key={m.id_match} style={{ borderBottom: '1px solid #334155' }}>
                                            <td style={{ padding: '12px 8px' }}>{formatWaktu(m.jadwal)}</td>
                                            <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{m.nama_tim_a || `Tim ID ${m.id_team_a}`}</td>
                                            <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{m.nama_tim_b || `Tim ID ${m.id_team_b}`}</td>
                                            <td style={{ padding: '12px 8px', color: '#10b981' }}>{m.match_format}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum ada pertandingan yang dijadwalkan untuk turnamen ini.</p>
                    )}
                </div>

            </div>
        </div>
    );
}
