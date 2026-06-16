import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;
    const currentUserId = currentUser ? parseInt(currentUser.id_user) : null;

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            if (data.status === 'success') {
                setUsers(data.data || []);
            }
        } catch (error) {
            console.error("Gagal mengambil data user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id, username) => {
        if (id === 1) {
            alert('Anda tidak diizinkan menghapus Super Admin!');
            return;
        }

        if (id === currentUserId) {
            alert('Anda tidak bisa menghapus akun Anda sendiri saat sedang login!');
            return;
        }

        const isConfirm = window.confirm(`PERINGATAN! Yakin ingin menghapus akun ${username}? Tindakan ini tidak bisa dibatalkan!`);
        if (!isConfirm) return;

        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                alert('🗑️ Akun berhasil dihapus permanen!');
                setUsers(users.filter(u => u.id_user !== id));
            } else {
                alert(`Gagal: ${result.message}`);
            }
        } catch (error) {
            alert('Gagal terhubung ke server.');
        }
    };

    return (
        <AdminLayout>
            <header className="db-header">
                <div className="header-title">
                    <h1>Kelola Akun Pengguna</h1>
                    <p>Melihat dan menghapus pengguna yang terdaftar di dalam sistem portal.</p>
                </div>
                <div className="header-actions">
                    <button className="action-btn" onClick={fetchUsers} disabled={isLoading}>
                        {isLoading ? 'Memuat...' : 'Refresh Data'}
                    </button>
                </div>
            </header>

            <div className="db-body">
                <div className="panel-box">
                    <div className="panel-header">
                        <div>
                            <h3>Daftar Pengguna Terdaftar</h3>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th style={{ textAlign: 'right' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748B', padding: '32px 0' }}>
                                            Tidak ada data pengguna.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id_user}>
                                            <td style={{ fontWeight: 'bold', color: '#10B981' }}>#{user.id_user}</td>
                                            <td><div style={{ fontWeight: '600', color: '#FFF' }}>{user.username}</div></td>
                                            <td style={{ color: '#CBD5E1' }}>{user.email}</td>
                                            <td>
                                                <span style={{
                                                    background: user.role?.toLowerCase() === 'admin' ? '#ef4444' : '#3b82f6',
                                                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                                                }}>
                                                    {user.role ? user.role.toUpperCase() : 'USER'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                {user.id_user !== 1 && user.id_user !== currentUserId ? (
                                                    <button
                                                        className="action-btn delete-btn"
                                                        style={{ padding: '6px 12px', fontSize: '13px' }}
                                                        onClick={() => handleDeleteUser(user.id_user, user.username)}
                                                    >
                                                        🗑️ Hapus Akun
                                                    </button>
                                                ) : (
                                                    <span style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic' }}>Protected</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
