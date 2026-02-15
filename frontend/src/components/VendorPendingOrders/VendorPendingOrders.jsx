import { useState, useEffect } from 'react';
import orderService from '../../Services/orderService';
import styles from './VendorPendingOrders.module.css';

export default function VendorPendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateStatus, setUpdateStatus] = useState({});

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const result = await orderService.getVendorPendingOrders();
      if (result.success) {
        setOrders(result.pending_orders || []);
      }
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError('Failed to load pending orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdateStatus(prev => ({ ...prev, [orderId]: true }));
    try {
      const result = await orderService.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update order status');
    } finally {
      setUpdateStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getDaysUntilPickup = (prepDate) => {
    const today = new Date();
    const prep = new Date(prepDate);
    const diff = Math.ceil((prep - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getUrgencyClass = (prepDate) => {
    const days = getDaysUntilPickup(prepDate);
    if (days <= 0) return styles.urgent;
    if (days == 1) return styles.warning;
    return styles.normal;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h3>📋 Pending Orders</h3>
        <div className={styles.loading}>Loading your orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <h3>📋 Pending Orders</h3>
        <div className={styles.empty}>
          <p>No pending orders</p>
          <small>Orders will appear here as customers place them</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>📋 Pending Orders ({orders.length})</h3>
        <button onClick={fetchPendingOrders} className={styles.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.ordersList}>
        {orders.map(order => (
          <div key={order.id} className={`${styles.orderCard} ${getUrgencyClass(order.preparation_date)}`}>
            <div className={styles.cardHeader}>
              <div className={styles.orderInfo}>
                <h4>{order.gift_title}</h4>
                <small>Order #{order.id}</small>
              </div>
              <div className={styles.statusBadge}>
                {order.is_read ? '👀' : '🔴'} {order.is_read ? 'Read' : 'New'}
              </div>
            </div>

            <div className={styles.giftImage}>
              <img 
                src={`/uploads/gifts/${order.image}`} 
                alt={order.gift_title}
                onError={(e) => { e.target.src = '/default-gift.png'; }}
              />
            </div>

            <div className={styles.cardContent}>
              <div className={styles.contentRow}>
                <span className={styles.label}>From:</span>
                <strong>{order.first_name} {order.last_name}</strong>
              </div>
              
              <div className={styles.contentRow}>
                <span className={styles.label}>Quantity:</span>
                <strong>×{order.quantity}</strong>
              </div>

              <div className={styles.contentRow}>
                <span className={styles.label}>Delivery:</span>
                <strong>{new Date(order.delivery_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</strong>
              </div>

              <div className={styles.contentRow}>
                <span className={styles.label}>Prepare before:</span>
                <strong className={styles.prepDate}>
                  {new Date(order.preparation_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                  <span className={styles.daysLeft}>
                    ({getDaysUntilPickup(order.preparation_date)} days)
                  </span>
                </strong>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => handleStatusChange(order.id, 'preparing')}
                disabled={updateStatus[order.id]}
                className={styles.primaryBtn}
              >
                {updateStatus[order.id] ? '⏳ Updating...' : '⚙️ Mark Preparing'}
              </button>
              <button
                onClick={() => handleStatusChange(order.id, 'ready_for_pickup')}
                disabled={updateStatus[order.id]}
                className={styles.successBtn}
              >
                {updateStatus[order.id] ? '⏳ Updating...' : '✓ Ready Pickup'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.dot + ' ' + styles.urgent}></span>
          <span>Pickup Today</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.dot + ' ' + styles.warning}></span>
          <span>Tomorrow</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.dot + ' ' + styles.normal}></span>
          <span>Future Orders</span>
        </div>
      </div>
    </div>
  );
}
