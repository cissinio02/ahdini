import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';
import Button from '../../components/UI/button';
import ToastPro from '../../components/UI/ToastPro';
import { adminService } from '../../Services/adminService';
import { 
    Store, 
    Package, 
    TrendingUp,
    Grid,
    ShoppingCart,
    Calendar,
    Truck,
    Users,
    Settings,
    CheckCircle,
    XCircle,
    Eye,
    Trash2,
    Ban,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, title, value, subtitle, trend, iconBg, accentColor }) => (
    <div className={styles.statCard} style={{ borderTop: `3px solid ${accentColor || '#c9a55a'}` }}>
        <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ backgroundColor: iconBg }}>
                <Icon size={20} color={accentColor || '#c9a55a'} />
            </div>
            <span className={styles.statTitle}>{title}</span>
        </div>
        <div className={styles.statValue}>{value}</div>
        {subtitle && <div className={styles.statSubtitle}>{subtitle}</div>}
        {trend && (
            <div className={styles.statTrend}>
                <TrendingUp size={14} />
                <span>{trend}</span>
            </div>
        )}
    </div>
);

const PendingVendorCard = ({ vendor, onApprove, onReject }) => (
    <div className={styles.pendingCard}>
        <div className={styles.pendingHeader}>
            <div className={styles.vendorInfo}>
                <div className={styles.vendorAvatar}>
                    <Store size={20} color="#c9a55a" />
                </div>
                <div>
                    <h4>{vendor.first_name} {vendor.last_name}</h4>
                    <p>{vendor.email}</p>
                </div>
            </div>
            <span className={styles.pendingBadge}>Pending</span>
        </div>
        <div className={styles.pendingDetails}>
            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>{vendor.email}</span>
            </div>
            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Applied:</span>
                <span className={styles.detailValue}>{new Date(vendor.created_at).toLocaleDateString()}</span>
            </div>
        </div>
        <div className={styles.pendingActions}>
            <button className={styles.approveBtn} onClick={() => onApprove(vendor.id)}>
                <CheckCircle size={16} />
                Approve
            </button>
            <button className={styles.rejectBtn} onClick={() => onReject(vendor.id)}>
                <XCircle size={16} />
                Reject
            </button>
        </div>
    </div>
);

const ProductApprovalRow = ({ product, onApprove, onReject }) => (
    <tr className={styles.tableRow}>
        <td className={styles.tableCell}>
            <div className={styles.productCell}>
                <div className={styles.productImage}>
                    <Package size={20} color="#c9a55a" />
                </div>
                <div>
                    <strong>{product.title}</strong>
                    <span className={styles.vendorTag}>{product.first_name} {product.last_name}</span>
                </div>
            </div>
        </td>
        <td className={styles.tableCell}>{product.category}</td>
        <td className={styles.tableCell}>${product.price.toFixed(2)}</td>
        <td className={styles.tableCell}>{new Date(product.created_at).toLocaleDateString()}</td>
        <td className={styles.tableCell}>
            <div className={styles.actionButtons}>
                <button className={styles.approveIconBtn} onClick={() => onApprove(product.id)}>
                    <CheckCircle size={18} />
                </button>
                <button className={styles.rejectIconBtn} onClick={() => onReject(product.id)}>
                    <XCircle size={18} />
                </button>
            </div>
        </td>
    </tr>
);

const VendorRow = ({ vendor, onBan }) => (
    <tr className={styles.tableRow}>
        <td className={styles.tableCell}>
            <div className={styles.productCell}>
                <div className={styles.vendorAvatar}>
                    <Store size={18} color="#c9a55a" />
                </div>
                <div>
                    <strong>{vendor.first_name} {vendor.last_name}</strong>
                    <span className={styles.vendorTag}>{vendor.email}</span>
                </div>
            </div>
        </td>
        <td className={styles.tableCell}>{vendor.products || 0} products</td>
        <td className={styles.tableCell}>
            <div className={styles.ratingBadge}>
                ⭐ {(vendor.rating || 0).toFixed(1)}
            </div>
        </td>
        <td className={styles.tableCell}>
            <span className={`${styles.statusBadge} ${styles[vendor.status || 'active']}`}>
                {vendor.status || 'active'}
            </span>
        </td>
        <td className={styles.tableCell}>
            <div className={styles.vendorActions}>
                <button className={styles.deleteIconBtn} onClick={() => onBan(vendor.id)}>
                    <Ban size={16} />
                </button>
            </div>
        </td>
    </tr>
);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [stats, setStats] = useState(null);
    const [pendingVendors, setPendingVendors] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);
    const [activeVendors, setActiveVendors] = useState([]);

    const navItems = [
        { name: 'Dashboard', icon: Grid },
        { name: 'Orders', icon: ShoppingCart },
        { name: 'Vendors', icon: Store },
        { name: 'Products', icon: Package },
        { name: 'Customers', icon: Users },
        { name: 'Settings', icon: Settings }
    ];

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, vendorsRes, productsRes, activeRes] = await Promise.all([
                adminService.getStats(),
                adminService.getPendingVendors(),
                adminService.getPendingProducts(),
                adminService.getActiveVendors()
            ]);

            if (statsRes.status === 'success') {
                setStats(statsRes.data);
            }
            if (vendorsRes.status === 'success') {
                setPendingVendors(vendorsRes.data || []);
            }
            if (productsRes.status === 'success') {
                setPendingProducts(productsRes.data || []);
            }
            if (activeRes.status === 'success') {
                setActiveVendors(activeRes.data || []);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setToast({ message: 'Failed to load dashboard data', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleApproveVendor = async (vendorId) => {
        try {
            const result = await adminService.approveVendor(vendorId);
            if (result.status === 'success') {
                setToast({ message: 'Vendor approved', type: 'success' });
                loadDashboardData();
            } else {
                setToast({ message: result.message, type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Error approving vendor', type: 'error' });
        }
    };

    const handleRejectVendor = async (vendorId) => {
        try {
            const result = await adminService.rejectVendor(vendorId);
            if (result.status === 'success') {
                setToast({ message: 'Vendor rejected', type: 'success' });
                loadDashboardData();
            } else {
                setToast({ message: result.message, type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Error rejecting vendor', type: 'error' });
        }
    };

    const handleApproveProduct = async (productId) => {
        try {
            const result = await adminService.approveProduct(productId);
            if (result.status === 'success') {
                setToast({ message: 'Product approved', type: 'success' });
                loadDashboardData();
            } else {
                setToast({ message: result.message, type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Error approving product', type: 'error' });
        }
    };

    const handleRejectProduct = async (productId) => {
        try {
            const result = await adminService.rejectProduct(productId);
            if (result.status === 'success') {
                setToast({ message: 'Product rejected', type: 'success' });
                loadDashboardData();
            } else {
                setToast({ message: result.message, type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Error rejecting product', type: 'error' });
        }
    };

    const handleBanVendor = async (vendorId) => {
        if (!window.confirm('Ban this vendor?')) return;
        try {
            const result = await adminService.banVendor(vendorId);
            if (result.status === 'success') {
                setToast({ message: 'Vendor banned', type: 'success' });
                loadDashboardData();
            } else {
                setToast({ message: result.message, type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Error banning vendor', type: 'error' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className={styles.dashboardContainer}>
                <p style={{ padding: '20px', textAlign: 'center' }}>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            {toast && <ToastPro message={toast.message} type={toast.type} />}
            
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBox}>
                        <Store size={24} color="#fff" />
                    </div>
                    <div className={styles.brandInfo}>
                        <h3>Ahdini</h3>
                        <span className={styles.adminBadge}>Admin</span>
                    </div>
                    <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            className={`${styles.navItem} ${activeNav === item.name ? styles.navItemActive : ''}`}
                            onClick={() => {
                                setActiveNav(item.name);
                                setSidebarOpen(false);
                            }}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Top Bar */}
                <div className={styles.topBar}>
                    <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <h1>{activeNav}</h1>
                </div>

                {/* Content Area */}
                <div className={styles.contentArea}>
                    {activeNav === 'Dashboard' && (
                        <>
                            {/* Stats Cards */}
                            <div className={styles.statsGrid}>
                                <StatCard
                                    icon={Store}
                                    title="Total Vendors"
                                    value={stats?.totalVendors || 0}
                                    subtitle={`${stats?.newVendorsThisMonth || 0} new this month`}
                                    iconBg="#fff3e0"
                                    accentColor="#ff9800"
                                />
                                <StatCard
                                    icon={Package}
                                    title="Marketplace Products"
                                    value={stats?.marketplaceProducts || 0}
                                    subtitle={`${stats?.productsAwaitingApproval || 0} pending approval`}
                                    iconBg="#e8f5e9"
                                    accentColor="#4caf50"
                                />
                                <StatCard
                                    icon={ShoppingCart}
                                    title="Pending Vendors"
                                    value={stats?.pendingVendorRequests || 0}
                                    subtitle="Awaiting approval"
                                    iconBg="#f3e5f5"
                                    accentColor="#9c27b0"
                                />
                            </div>

                            {/* Pending Vendors Section */}
                            <div className={styles.section}>
                                <h2>Pending Vendor Approvals</h2>
                                <div className={styles.cardGrid}>
                                    {pendingVendors.length > 0 ? (
                                        pendingVendors.map(vendor => (
                                            <PendingVendorCard
                                                key={vendor.id}
                                                vendor={vendor}
                                                onApprove={handleApproveVendor}
                                                onReject={handleRejectVendor}
                                            />
                                        ))
                                    ) : (
                                        <p>No pending vendors</p>
                                    )}
                                </div>
                            </div>

                            {/* Pending Products Section */}
                            <div className={styles.section}>
                                <h2>Pending Product Approvals</h2>
                                {pendingProducts.length > 0 ? (
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Submitted</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingProducts.map(product => (
                                                <ProductApprovalRow
                                                    key={product.id}
                                                    product={product}
                                                    onApprove={handleApproveProduct}
                                                    onReject={handleRejectProduct}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No pending products</p>
                                )}
                            </div>
                        </>
                    )}

                    {activeNav === 'Vendors' && (
                        <div className={styles.section}>
                            <h2>Active Vendors</h2>
                            {activeVendors.length > 0 ? (
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Products</th>
                                            <th>Rating</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeVendors.map(vendor => (
                                            <VendorRow
                                                key={vendor.id}
                                                vendor={vendor}
                                                onBan={handleBanVendor}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No active vendors</p>
                            )}
                        </div>
                    )}

                    {activeNav === 'Orders' && (
                        <div className={styles.section}>
                            <h2>Orders</h2>
                            <p>Orders management coming soon...</p>
                        </div>
                    )}

                    {activeNav === 'Products' && (
                        <div className={styles.section}>
                            <h2>All Products</h2>
                            <p>Products management coming soon...</p>
                        </div>
                    )}

                    {activeNav === 'Customers' && (
                        <div className={styles.section}>
                            <h2>Customers</h2>
                            <p>Customers management coming soon...</p>
                        </div>
                    )}

                    {activeNav === 'Settings' && (
                        <div className={styles.section}>
                            <h2>Settings</h2>
                            <p>Settings management coming soon...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
