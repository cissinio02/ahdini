import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';
import Button from '../../components/UI/button';
import Input from '../../components/UI/Input';
import { 
    Store, 
    Package, 
    UserPlus, 
    TrendingUp, 
    Search,
    Bell,
    MessageSquare,
    Grid,
    ShoppingCart,
    Calendar,
    Truck,
    Users,
    Settings,
    HelpCircle,
    ChevronDown,
    MoreVertical,
    CheckCircle,
    XCircle,
    Eye,
    Trash2,
    Ban,
    Filter
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockAdminData = {
    stats: {
        totalVendors: 128,
        newVendorsThisMonth: 12,
        marketplaceProducts: 2431,
        productsAwaitingApproval: 184,
        pendingVendorRequests: 9
    },
    pendingVendors: [
        { id: 1, shopName: 'Luxury Roses', owner: 'Sarah Johnson', email: 'sarah@luxuryroses.com', location: 'Algiers', requestedAt: '2024-02-08', status: 'pending' },
        { id: 2, shopName: 'Golden Sweets', owner: 'Ahmed Benaissa', email: 'ahmed@goldensweets.dz', location: 'Oran', requestedAt: '2024-02-07', status: 'pending' },
        { id: 3, shopName: 'Premium Gifts Co', owner: 'Fatima Meziane', email: 'fatima@premiumgifts.com', location: 'Constantine', requestedAt: '2024-02-06', status: 'pending' }
    ],
    pendingProducts: [
        { id: 101, name: 'Red Velvet Roses Box', vendor: 'Luxury Roses', category: 'Flowers', price: 85.00, submittedAt: '2024-02-09', status: 'pending' },
        { id: 102, name: 'Belgian Chocolate Set', vendor: 'Golden Sweets', category: 'Food & Treats', price: 45.00, submittedAt: '2024-02-09', status: 'pending' },
        { id: 103, name: 'Leather Wallet Premium', vendor: 'Premium Gifts Co', category: 'Accessories', price: 95.00, submittedAt: '2024-02-08', status: 'pending' },
        { id: 104, name: 'Scented Candle Set', vendor: 'Luxury Roses', category: 'Home & Living', price: 35.00, submittedAt: '2024-02-08', status: 'pending' }
    ],
    activeVendors: [
        { id: 201, shopName: 'Bloom & Petals', owner: 'Karim Mansouri', location: 'Algiers', products: 45, rating: 4.8, status: 'active', joinedAt: '2024-01-15' },
        { id: 202, shopName: 'Sweet Moments', owner: 'Amina Cherif', location: 'Oran', products: 32, rating: 4.6, status: 'active', joinedAt: '2024-01-20' },
        { id: 203, shopName: 'Artisan Crafts', owner: 'Youcef Hamidi', location: 'Annaba', products: 28, rating: 4.9, status: 'active', joinedAt: '2024-01-25' },
        { id: 204, shopName: 'Gourmet Treats', owner: 'Samia Belkacem', location: 'Constantine', products: 56, rating: 4.7, status: 'active', joinedAt: '2024-02-01' }
    ],
    recentActivity: [
        { type: 'vendor_approved', message: 'New vendor "Luxury Blooms" approved', time: '2 hours ago' },
        { type: 'product_approved', message: '5 new products approved', time: '4 hours ago' },
        { type: 'vendor_banned', message: 'Vendor "Fake Goods Inc" banned for policy violation', time: '1 day ago' }
    ]
};

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

const PendingVendorCard = ({ vendor, onApprove, onReject, onViewDetails }) => (
    <div className={styles.pendingCard}>
        <div className={styles.pendingHeader}>
            <div className={styles.vendorInfo}>
                <div className={styles.vendorAvatar}>
                    <Store size={20} color="#c9a55a" />
                </div>
                <div>
                    <h4>{vendor.shopName}</h4>
                    <p>{vendor.owner}</p>
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
                <span className={styles.detailLabel}>Location:</span>
                <span className={styles.detailValue}>{vendor.location}</span>
            </div>
            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Requested:</span>
                <span className={styles.detailValue}>{vendor.requestedAt}</span>
            </div>
        </div>
        <div className={styles.pendingActions}>
            <button className={styles.viewBtn} onClick={() => onViewDetails(vendor)}>
                <Eye size={16} />
                View Details
            </button>
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
                    <strong>{product.name}</strong>
                    <span className={styles.vendorTag}>{product.vendor}</span>
                </div>
            </div>
        </td>
        <td className={styles.tableCell}>{product.category}</td>
        <td className={styles.tableCell}>${product.price.toFixed(2)}</td>
        <td className={styles.tableCell}>{product.submittedAt}</td>
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

const VendorRow = ({ vendor, onBan, onViewShop, onDelete }) => (
    <tr className={styles.tableRow}>
        <td className={styles.tableCell}>
            <div className={styles.productCell}>
                <div className={styles.vendorAvatar}>
                    <Store size={18} color="#c9a55a" />
                </div>
                <div>
                    <strong>{vendor.shopName}</strong>
                    <span className={styles.vendorTag}>{vendor.owner}</span>
                </div>
            </div>
        </td>
        <td className={styles.tableCell}>{vendor.location}</td>
        <td className={styles.tableCell}>{vendor.products} products</td>
        <td className={styles.tableCell}>
            <div className={styles.ratingBadge}>
                ⭐ {vendor.rating}
            </div>
        </td>
        <td className={styles.tableCell}>
            <span className={`${styles.statusBadge} ${styles[vendor.status]}`}>
                {vendor.status}
            </span>
        </td>
        <td className={styles.tableCell}>
            <div className={styles.vendorActions}>
                <button className={styles.actionIconBtn} onClick={() => onViewShop(vendor.id)}>
                    <Eye size={16} />
                </button>
                <button className={styles.actionIconBtn} onClick={() => onBan(vendor.id)}>
                    <Ban size={16} />
                </button>
                <button className={styles.deleteIconBtn} onClick={() => onDelete(vendor.id)}>
                    <Trash2 size={16} />
                </button>
            </div>
        </td>
    </tr>
);

export default function AdminDashboard() {
    const [data, setData] = useState(mockAdminData);
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Navigation items
    const navItems = [
        { name: 'Dashboard', icon: Grid, section: null },
        { name: 'Orders', icon: ShoppingCart, section: 'OPERATIONS' },
        { name: 'Calendar', icon: Calendar, section: 'OPERATIONS' },
        { name: 'Deliveries', icon: Truck, section: 'OPERATIONS' },
        { name: 'Vendors', icon: Store, section: 'MARKETPLACE' },
        { name: 'Products', icon: Package, section: 'MARKETPLACE' },
        { name: 'Customers', icon: Users, section: 'USERS & SYSTEM' },
        { name: 'Settings', icon: Settings, section: 'USERS & SYSTEM' }
    ];

    // Group navigation items by section
    const groupedNav = navItems.reduce((acc, item) => {
        const section = item.section || 'main';
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
    }, {});

    const handleApproveVendor = (vendorId) => {
        console.log('Approving vendor:', vendorId);
        // API call to approve vendor
    };

    const handleRejectVendor = (vendorId) => {
        console.log('Rejecting vendor:', vendorId);
        // API call to reject vendor
    };

    const handleViewVendorDetails = (vendor) => {
        console.log('Viewing vendor details:', vendor);
        // Open modal or navigate to details page
    };

    const handleApproveProduct = (productId) => {
        console.log('Approving product:', productId);
        // API call to approve product
    };

    const handleRejectProduct = (productId) => {
        console.log('Rejecting product:', productId);
        // API call to reject product
    };

    const handleBanVendor = (vendorId) => {
        if (window.confirm('Are you sure you want to ban this vendor?')) {
            console.log('Banning vendor:', vendorId);
            // API call to ban vendor
        }
    };

    const handleDeleteVendor = (vendorId) => {
        if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
            console.log('Deleting vendor:', vendorId);
            // API call to delete vendor
        }
    };

    const handleViewShop = (vendorId) => {
        console.log('Viewing shop:', vendorId);
        // Navigate to shop details page
    };

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
                        <span className={styles.adminBadge}>Admin</span>
                    </div>
                </div>

                <nav className={styles.sidebarNav}>
                    {Object.entries(groupedNav).map(([section, items]) => (
                        <div key={section}>
                            {section !== 'main' && (
                                <div className={styles.navSection}>{section}</div>
                            )}
                            {items.map((item) => (
                                <button
                                    key={item.name}
                                    className={`${styles.navItem} ${activeNav === item.name ? styles.navItemActive : ''}`}
                                    onClick={() => setActiveNav(item.name)}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Help & Support */}
                <div className={styles.sidebarFooter}>
                    <button className={styles.helpButton}>
                        <HelpCircle size={20} />
                        <span>Help & Support</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Top Bar */}
                <header className={styles.topBar}>
                    <div className={styles.searchBar}>
                        <Search size={20} className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Search vendors, products, or orders..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className={styles.topBarActions}>
                        <button className={styles.iconButton}>
                            <Bell size={20} />
                            <span className={styles.notificationBadge}>3</span>
                        </button>
                        <button className={styles.iconButton}>
                            <MessageSquare size={20} />
                            <span className={styles.notificationBadge}>5</span>
                        </button>
                        <div className={styles.userMenu}>
                            <button 
                                className={styles.userMenuButton}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <img 
                                    src="/api/placeholder/40/40" 
                                    alt="Admin" 
                                    className={styles.userAvatar}
                                />
                                <div className={styles.userInfo}>
                                    <strong>Admin User</strong>
                                    <span>Marketplace Admin</span>
                                </div>
                                <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Marketplace Overview</h1>
                        <div className={styles.breadcrumb}>
                            <span>Home</span>
                            <span className={styles.breadcrumbSeparator}>›</span>
                            <span>Dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <StatCard 
                        icon={Store}
                        title="TOTAL VENDORS"
                        value={data.stats.totalVendors}
                        subtitle="Approved and active stores"
                        trend={`+${data.stats.newVendorsThisMonth} new this month`}
                        iconBg="#FFF4E6"
                        accentColor="#8B0000"
                    />
                    <StatCard 
                        icon={Package}
                        title="MARKETPLACE PRODUCTS"
                        value={data.stats.marketplaceProducts.toLocaleString()}
                        subtitle="Live & visible to customers"
                        trend={`${data.stats.productsAwaitingApproval} awaiting approval`}
                        iconBg="#FFF9E6"
                        accentColor="#c9a55a"
                    />
                    <StatCard 
                        icon={UserPlus}
                        title="PENDING VENDOR REQUESTS"
                        value={data.stats.pendingVendorRequests}
                        subtitle="New accounts to review"
                        iconBg="#FFF0E6"
                        accentColor="#FF8C42"
                    />
                </div>

                {/* Main Content Grid */}
                <div className={styles.contentLayout}>
                    {/* Pending Vendor Requests */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Pending Vendor Requests</h2>
                            <span className={styles.badge}>{data.pendingVendors.length}</span>
                        </div>
                        <div className={styles.pendingGrid}>
                            {data.pendingVendors.map(vendor => (
                                <PendingVendorCard 
                                    key={vendor.id}
                                    vendor={vendor}
                                    onApprove={handleApproveVendor}
                                    onReject={handleRejectVendor}
                                    onViewDetails={handleViewVendorDetails}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Products Awaiting Approval */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Products Awaiting Approval</h2>
                            <button className={styles.filterButton}>
                                <Filter size={16} />
                                Filter
                            </button>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.tableHeaderRow}>
                                        <th className={styles.tableHeaderCell}>Product</th>
                                        <th className={styles.tableHeaderCell}>Category</th>
                                        <th className={styles.tableHeaderCell}>Price</th>
                                        <th className={styles.tableHeaderCell}>Submitted</th>
                                        <th className={styles.tableHeaderCell}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.pendingProducts.map(product => (
                                        <ProductApprovalRow 
                                            key={product.id}
                                            product={product}
                                            onApprove={handleApproveProduct}
                                            onReject={handleRejectProduct}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Active Vendors */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Active Vendors</h2>
                            <a href="#" className={styles.viewAllLink}>View all vendors</a>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.tableHeaderRow}>
                                        <th className={styles.tableHeaderCell}>Shop Name</th>
                                        <th className={styles.tableHeaderCell}>Location</th>
                                        <th className={styles.tableHeaderCell}>Products</th>
                                        <th className={styles.tableHeaderCell}>Rating</th>
                                        <th className={styles.tableHeaderCell}>Status</th>
                                        <th className={styles.tableHeaderCell}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.activeVendors.map(vendor => (
                                        <VendorRow 
                                            key={vendor.id}
                                            vendor={vendor}
                                            onBan={handleBanVendor}
                                            onViewShop={handleViewShop}
                                            onDelete={handleDeleteVendor}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}