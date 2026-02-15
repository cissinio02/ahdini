import React, { useState, useEffect } from 'react';
import styles from './Payments.module.css';
import { CreditCard, Download } from 'lucide-react';
import vendorService from '../../Services/vendorService';
import { showErrorToast } from '../../components/UI/ToastPro';

const Payments = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bankInfo, setBankInfo] = useState({
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        lastPayout: null
    });

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const fetchPaymentHistory = async () => {
        setLoading(true);
        try {
            const res = await vendorService.getShopSettings();
            if (res?.status === 'success') {
                setBankInfo(res.data?.bankInfo || {});
                setPaymentHistory(res.data?.paymentHistory || []);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showErrorToast('Error', 'Failed to load payment information');
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        'Completed': '#4CAF50',
        'Pending': '#FF8C42',
        'Failed': '#F44336'
    };

    if (loading) return <div className={styles.container}><p>Loading payments...</p></div>;

    return (
        <div className={styles.container}>
            <h2>Payments & Payouts</h2>

            <div className={styles.bankInfoCard}>
                <div className={styles.bankIcon}>
                    <CreditCard size={32} />
                </div>
                <div className={styles.bankDetails}>
                    <h3>Payout Account</h3>
                    {bankInfo?.bankName ? (
                        <>
                            <p><strong>Bank:</strong> {bankInfo.bankName}</p>
                            <p><strong>Account Holder:</strong> {bankInfo.accountHolder}</p>
                            <p><strong>Account:</strong> ****{bankInfo.accountNumber?.slice(-4)}</p>
                            {bankInfo.lastPayout && (
                                <p><strong>Last Payout:</strong> {new Date(bankInfo.lastPayout).toLocaleDateString()}</p>
                            )}
                        </>
                    ) : (
                        <p>No payout account configured. Update your shop settings.</p>
                    )}
                </div>
            </div>

            <h3 style={{ marginTop: '2rem' }}>Payment History</h3>
            {paymentHistory.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No payment history yet.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Payout ID</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((payment) => (
                                <tr key={payment.id}>
                                    <td>{payment.id}</td>
                                    <td>${parseFloat(payment.amount).toFixed(2)}</td>
                                    <td>
                                        <span 
                                            className={styles.status}
                                            style={{
                                                backgroundColor: `${statusColors[payment.status] || '#999'}20`,
                                                color: statusColors[payment.status] || '#999'
                                            }}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                    <td>
                                        <button className={styles.downloadBtn}>
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Payments;
