import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/AdminLayout.css';

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ username: 'Loading...', email: 'Loading...' });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser({
                    username: parsedUser.username,
                    email: parsedUser.email
                });
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error("Gagal membaca data user dari penyimpanan:", error);
            setUser({ username: 'Error', email: 'Data rusak' });
        }
    }, [navigate]);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar dari META Portal?");
        if (!confirmLogout) return;

        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const menuItems = [
        { name: 'Dashboard Overview', icon: '📊', path: '/dashboard-admin', active: location.pathname === '/dashboard-admin' },
        { name: 'Manage News', icon: '📰', path: '/admin/news', active: location.pathname.includes('/admin/news') },
    ];

    return (
        <div className="db-container">
            <aside className="db-sidebar">
                <div>
                    <div className="sidebar-brand">
                        <span className="brand-icon">⚔️</span>
                        <span>META Admin</span>
                    </div>
                    <nav className="sidebar-menu">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`menu-btn ${item.active ? 'active' : ''}`}
                                onClick={() => handleMenuClick(item.path)}
                            >
                                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-profile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="profile-avatar">
                            {user.username && user.username !== 'Loading...' ? user.username.substring(0, 2).toUpperCase() : '??'}
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#FFF' }}>{user.username}</p>
                            <p style={{ fontSize: '12px', color: '#10B981', margin: '2px 0 0 0', fontWeight: '500' }}>{user.email}</p>
                        </div>
                    </div>
                    <button className="logout-btn" title="Keluar" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>

            <main className="db-main">
                {children}
            </main>
        </div>
    );
}
