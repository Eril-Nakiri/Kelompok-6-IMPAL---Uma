import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/InputMatch.css';

export default function InputMatch() {
    const location = useLocation();
    const navigate = useNavigate();

    const tournament = location.state?.tournament;

    const [isLoading, setIsLoading] = useState(false);
    const [teams, setTeams] = useState([]);

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
            alert('Akses tidak valid. Silakan pilih turnamen terlebih dahulu.');
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

        fetchTeams();
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

                <div style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: '8px', border: '1px solid #334155' }}>
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

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    backgroundColor: '#10b981', color: '#FFF', padding: '12px 24px',
                                    border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Menyimpan...' : '💾 Simpan Jadwal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
