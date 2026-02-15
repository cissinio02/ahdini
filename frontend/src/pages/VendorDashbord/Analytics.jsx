import React, { useState, useEffect } from 'react';
import styles from './Analytics.module.css';
import vendorService from '../../Services/vendorService';
import { showErrorToast } from '../../components/UI/ToastPro';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await vendorService.getAnalytics();
            if (res?.status === 'success') {
                setAnalytics(res.data || {});
            } else {
                showErrorToast('Error', res?.message || 'Failed to load analytics');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showErrorToast('Error', 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.container}><p>Loading analytics...</p></div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Analytics</h2>
                <div className={styles.periodSelector}>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ backgroundColor: '#FFF4E6' }}>
                        <TrendingUp size={24} color="#FF8C42" />
                    </div>
                    <h3>Total Revenue</h3>
                    <p className={styles.metricValue}>${analytics?.totalRevenue || '0.00'}</p>
                    <span className={styles.metricChange}>+{analytics?.revenueChange || '0'}% from last period</span>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ backgroundColor: '#E8F5E9' }}>
                        <BarChart3 size={24} color="#4CAF50" />
                    </div>
                    <h3>Total Orders</h3>
                    <p className={styles.metricValue}>{analytics?.totalOrders || '0'}</p>
                    <span className={styles.metricChange}>+{analytics?.ordersChange || '0'}% from last period</span>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ backgroundColor: '#E3F2FD' }}>
                        <Calendar size={24} color="#2196F3" />
                    </div>
                    <h3>Average Order Value</h3>
                    <p className={styles.metricValue}>${analytics?.avgOrderValue || '0.00'}</p>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ backgroundColor: '#FFF9C4' }}>
                        <TrendingUp size={24} color="#FBC02D" />
                    </div>
                    <h3>Conversion Rate</h3>
                    <p className={styles.metricValue}>{analytics?.conversionRate || '0'}%</p>
                </div>
            </div>

            <div className={styles.chartPlaceholder}>
                <p>📊 Detailed charts coming soon...</p>
            </div>
        </div>
    );
};

export default Analytics;
