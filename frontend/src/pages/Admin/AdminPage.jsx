import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { authContext } from '../../context/AuthContext';

export default function AdminPage() {
    const navigate = useNavigate();
    const { user } = useContext(authContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in and is admin
        if (!user) {
            navigate('/admin/login');
        } else if (user.role !== 'admin') {
            navigate('/');
        } else {
            setIsAdmin(true);
        }
        setLoading(false);
    }, [user, navigate]);

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!isAdmin) {
        return null;
    }

    return <AdminDashboard />;
}
