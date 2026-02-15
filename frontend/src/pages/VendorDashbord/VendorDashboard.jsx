import React, { useState, useEffect } from 'react';
import styles from './VendorDashboard.module.css';
import Button from '../../components/UI/button';
import { 
    DollarSign, 
    ShoppingCart, 
    Package, 
    Star, 
    TrendingUp, 
    Bell, 
    MessageSquare, 
    Grid, 
    Gift, 
    Users, 
    BarChart3, 
    Store, 
    CreditCard,
    ExternalLink
} from 'lucide-react';
import MyGifts from './MyGifts';
import Orders from './Orders';
import Customers from './Customers';
import Analytics from './Analytics';
import ShopSettings from './ShopSettings';
import Payments from './Payments';
import vendorService from '../../Services/vendorService';
import { showErrorToast } from '../../components/UI/ToastPro';

// Default empty state
const emptyDashboardData = {
    stats: {
        totalRevenue: 0,
        revenueChange: 0,
        totalOrders: 0,
        ordersChange: 0,
        activeGifts: 0,
        pendingApproval: 0,
        shopRating: 0,
        totalReviews: 0
    },
    recentOrders: [],
    topSellingGifts: [],
    shopInfo: {
        name: 'Your Shop',
        status: 'Online'
    }
};

const StatCard = ({ icon: Icon, title, value, change, subtitle, iconBg }) => (
    <div className={styles.statCard}>
        <div className={styles.statHeader}>
            <span className={styles.statTitle}>{title}</span>
            <div className={styles.statIcon} style={{ backgroundColor: iconBg }}>
                <Icon size={20} />
            </div>
        </div>
        <div className={styles.statValue}>{value}</div>
        {change && (
            <div className={styles.statChange}>
                <TrendingUp size={14} />
                <span>+{change}% from last month</span>
            </div>
        )}
        {subtitle && <div className={styles.statSubtitle}>{subtitle}</div>}
    </div>
);

const OrderRow = ({ order }) => {
    const statusColors = {
        'Pending': '#FF8C42',
        'Delivered': '#4CAF50',
        'Processing': '#2196F3',
        'Cancelled': '#F44336'
    };

    return (
        <tr className={styles.tableRow}>
            <td className={styles.tableCell}>{order.id}</td>
            <td className={styles.tableCell}>{order.customer}</td>
            <td className={styles.tableCell}>{order.gift}</td>
            <td className={styles.tableCell}>
                <span 
                    className={styles.statusBadge} 
                    style={{ 
                        backgroundColor: `${statusColors[order.status]}20`,
                        color: statusColors[order.status]
                    }}
                >
                    {order.status}
                </span>
            </td>
            <td className={styles.tableCell}>DA {order.total.toFixed(2)}</td>
        </tr>
    );
};

const TopSellingItem = ({ gift, rank }) => (
    <div className={styles.topSellingItem}>
        <div className={styles.giftPlaceholder}>
            <Gift size={24} color="#c9a55a" />
        </div>
        <div className={styles.giftInfo}>
            <h4>{gift.name}</h4>
            <p>DA {gift.price.toFixed(2)}</p>
        </div>
        <div className={styles.giftSales}>
            <strong>{gift.sold}</strong>
            <span>sold</span>
        </div>
    </div>
);

export default function VendorDashboard() {
    const [data, setData] = useState(emptyDashboardData);
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Get vendor info first
            const vendorRes = await vendorService.getVendorInfo();
            if (vendorRes?.first_name) {
                setData(prev => ({
                    ...prev,
                    shopInfo: {
                        name: vendorRes.shop_name || vendorRes.first_name + '\'s Shop',
                        status: 'Online',
                        logo: vendorRes.shop_logo
                    }
                }));
            }

            // Get analytics
            const analyticsRes = await vendorService.getAnalytics();
            if (analyticsRes?.status === 'success') {
                // Update stats from API
                setData(prev => ({
                    ...prev,
                    stats: {
                        totalRevenue: analyticsRes.data?.totalRevenue || 0,
                        revenueChange: analyticsRes.data?.revenueChange || 0,
                        totalOrders: analyticsRes.data?.totalOrders || 0,
                        ordersChange: analyticsRes.data?.ordersChange || 0,
                        activeGifts: analyticsRes.data?.activeGifts || 0,
                        pendingApproval: analyticsRes.data?.pendingApproval || 0,
                        shopRating: analyticsRes.data?.shopRating || 0,
                        totalReviews: analyticsRes.data?.totalReviews || 0
                    }
                }));
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showErrorToast('Error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Navigation items
    const navItems = [
        { name: 'Dashboard', icon: Grid },
        { name: 'My Gifts', icon: Gift },
        { name: 'Orders', icon: ShoppingCart },
        { name: 'Customers', icon: Users },
        { name: 'Analytics', icon: BarChart3 },
        { name: 'Shop Settings', icon: Store },
        { name: 'Payments', icon: CreditCard }
    ];

    return (
        <div className={styles.dashboardContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBox}>
                        <Store size={24} color="#fff" />
                    </div>
                    <div className={styles.brandInfo}>
                        <h3>Ahdini</h3>
                        <span className={styles.vendorBadge}>Vendor</span>
                    </div>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            className={`${styles.navItem} ${activeNav === item.name ? styles.navItemActive : ''}`}
                            onClick={() => setActiveNav(item.name)}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                {/* Shop Status Footer */}
                <div className={styles.sidebarFooter}>
                    <div className={styles.shopStatus}>
                        <img 
                            src={data.shopInfo.logo || "/api/placeholder/40/40"} 
                            alt="Shop" 
                            className={styles.shopAvatar}
                        />
                        <div className={styles.shopDetails}>
                            <strong>{data.shopInfo.name}</strong>
                            <span className={styles.onlineStatus}>
                                <span className={styles.onlineDot}></span>
                                {data.shopInfo.status}
                            </span>
                        </div>
                    </div>
                    <button className={styles.expandButton}>
                        <ExternalLink size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Top Bar */}
                <header className={styles.topBar}>
                    <h1 className={styles.pageTitle}>{activeNav}</h1>
                    <div className={styles.topBarActions}>
                        <button className={styles.iconButton}>
                            <Bell size={20} />
                        </button>
                        <button className={styles.iconButton}>
                            <MessageSquare size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Router */}
                {activeNav === 'Dashboard' && (
                    <>
                        {/* Stats Grid */}
                        <div className={styles.statsGrid}>
                            <StatCard 
                                icon={DollarSign}
                                title="Total Revenue"
                                value={`DA ${data.stats.totalRevenue.toLocaleString()}`}
                                change={data.stats.revenueChange}
                                iconBg="#FFF4E6"
                            />
                            <StatCard 
                                icon={ShoppingCart}
                                title="Total Orders"
                                value={data.stats.totalOrders}
                                change={data.stats.ordersChange}
                                iconBg="#E8F5E9"
                            />
                            <StatCard 
                                icon={Package}
                                title="Active Gifts"
                                value={data.stats.activeGifts}
                                subtitle={`${data.stats.pendingApproval} Pending Approval`}
                                iconBg="#E3F2FD"
                            />
                            <StatCard 
                                icon={Star}
                                title="Shop Rating"
                                value={data.stats.shopRating}
                                subtitle={`Based on ${data.stats.totalReviews} reviews`}
                                iconBg="#FFF9C4"
                            />
                        </div>

                        {/* Content Grid */}
                        <div className={styles.contentGrid}>
                            {/* Recent Orders */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2>Recent Orders</h2>
                                    <a href="#" className={styles.viewAllLink}>View all</a>
                                </div>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr className={styles.tableHeaderRow}>
                                                <th className={styles.tableHeaderCell}>Order ID</th>
                                                <th className={styles.tableHeaderCell}>Customer</th>
                                                <th className={styles.tableHeaderCell}>Gift</th>
                                                <th className={styles.tableHeaderCell}>Status</th>
                                                <th className={styles.tableHeaderCell}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.recentOrders.map((order) => (
                                                <OrderRow key={order.id} order={order} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Top Selling Gifts */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2>Top Selling Gifts</h2>
                                </div>
                                <div className={styles.topSellingList}>
                                    {data.topSellingGifts.map((gift, index) => (
                                        <TopSellingItem key={gift.name} gift={gift} rank={index + 1} />
                                    ))}
                                </div>
                                <a href="#" className={styles.reportLink}>View Performance Report</a>
                            </div>
                        </div>
                    </>
                )}

                {activeNav === 'My Gifts' && <MyGifts />}
                {activeNav === 'Orders' && <Orders />}
                {activeNav === 'Customers' && <Customers />}
                {activeNav === 'Analytics' && <Analytics />}
                {activeNav === 'Shop Settings' && <ShopSettings />}
                {activeNav === 'Payments' && <Payments />}
            </main>
        </div>
    );
}
