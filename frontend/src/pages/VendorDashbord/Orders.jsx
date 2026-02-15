import React, { useState, useEffect } from 'react';
import styles from './Orders.module.css';
import vendorService from '../../Services/vendorService';
import { showErrorToast } from '../../components/UI/ToastPro';

// Countdown deadline component
const DeadlineCountdown = ({ deliveryDate }) => {
    const [daysLeft, setDaysLeft] = useState(0);
    const [color, setColor] = useState('#4CAF50');

    useEffect(() => {
        const calculateDaysLeft = () => {
            const delivery = new Date(deliveryDate);
            const today = new Date();
            const diff = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
            setDaysLeft(diff);

            // Color based on urgency
            if (diff <= 0) setColor('#F44336'); // Red - Overdue
            else if (diff <= 3) setColor('#FF8C42'); // Orange - Urgent (3 days or less)
            else if (diff <= 7) setColor('#FFC107'); // Yellow - Soon (7 days or less)
            else setColor('#4CAF50'); // Green - Plenty of time
        };

        calculateDaysLeft();
        const interval = setInterval(calculateDaysLeft, 3600000); // Update every hour
        return () => clearInterval(interval);
    }, [deliveryDate]);

    const getLabel = () => {
        if (daysLeft <= 0) return 'OVERDUE';
        if (daysLeft === 1) return 'Tomorrow';
        if (daysLeft <= 3) return 'Urgent';
        return `${daysLeft}d left`;
    };

    return (
        <span 
            style={{
                backgroundColor: `${color}20`,
                color: color,
                padding: '6px 12px',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '12px',
                display: 'inline-block'
            }}
        >
            {getLabel()}
        </span>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await vendorService.getOrders();
            if (res?.status === 'success') {
                setOrders(res.data || []);
            } else {
                showErrorToast('Error', res?.message || 'Failed to load orders');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showErrorToast('Error', 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        'Pending': '#FF8C42',
        'Delivered': '#4CAF50',
        'Processing': '#2196F3',
        'Cancelled': '#F44336'
    };

    if (loading) return <div className={styles.container}><p>Loading orders...</p></div>;

    return (
        <div className={styles.container}>
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No orders yet.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Gift</th>
                                <th>Status</th>
                                <th>Deadline</th>
                                <th>Total</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.customer_name}</td>
                                    <td>{order.gift_name}</td>
                                    <td>
                                        <span 
                                            className={styles.status}
                                            style={{ 
                                                backgroundColor: `${statusColors[order.status] || '#999'}20`,
                                                color: statusColors[order.status] || '#999'
                                            }}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {order.delivery_date ? (
                                            <DeadlineCountdown deliveryDate={order.delivery_date} />
                                        ) : (
                                            <span style={{color: '#999', fontSize: '12px'}}>N/A</span>
                                        )}
                                    </td>
                                    <td>DA {parseFloat(order.total).toFixed(2)}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;
