import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../css/AdminLayout.css';

export default function SidebarAdmin() {
    const location = useLocation();

    return (
        <div className="admin-sidebar">
            <div className="admin-logo">META ADMIN</div>
            <div className="admin-menu">
                <Link to="/dashboard-admin" className={`admin-menu-item ${location.pathname === '/dashboard-admin' ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/admin/news" className={`admin-menu-item ${location.pathname.includes('/admin/news') ? 'active' : ''}`}>Manage News</Link>
                <Link to="/input-match" className={`admin-menu-item ${location.pathname === '/input-match' ? 'active' : ''}`}>Input Match</Link>
                <Link to="/dashboard" className="admin-menu-item">← Back to Portal</Link>
            </div>
        </div>
    );
}
