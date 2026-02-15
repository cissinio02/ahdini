import React, { useState, useEffect } from 'react';
import styles from './Customers.module.css';
import vendorService from '../../Services/vendorService';
import { showErrorToast } from '../../components/UI/ToastPro';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await vendorService.getCustomers();
            if (res?.status === 'success') {
                setCustomers(res.data || []);
            } else {
                showErrorToast('Error', res?.message || 'Failed to load customers');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showErrorToast('Error', 'Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.container}><p>Loading customers...</p></div>;

    return (
        <div className={styles.container}>
            <h2>Customers</h2>
            {customers.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No customers yet.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Total Orders</th>
                                <th>Total Spent</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.total_orders}</td>
                                    <td>${parseFloat(customer.total_spent).toFixed(2)}</td>
                                    <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Customers;
