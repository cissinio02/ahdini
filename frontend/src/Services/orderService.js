import api from '../api/axios';

const orderService = {
  // Client: Place a new order
  createOrder: async (orderData) => {
    try {
      const res = await api.post('orders.php?action=create_order', orderData);
      return res.data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  },

  // Client: Get my orders
  getMyOrders: async () => {
    try {
      const res = await api.get('orders.php?action=get_client_orders');
      return res.data;
    } catch (error) {
      console.error('Error fetching client orders:', error);
      throw error;
    }
  },

  // Vendor: Get all orders for my shop
  getVendorOrders: async () => {
    try {
      const res = await api.get('orders.php?action=get_vendor_orders');
      return res.data;
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      throw error;
    }
  },

  // Vendor: Get pending orders (awaiting preparation)
  getVendorPendingOrders: async () => {
    try {
      const res = await api.get('orders.php?action=get_vendor_pending');
      return res.data;
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      throw error;
    }
  },

  // Get single order details
  getOrder: async (orderId) => {
    try {
      const res = await api.get(`orders.php?action=get_order&id=${orderId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Vendor: Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await api.put('orders.php?action=update_order_status', {
        order_id: orderId,
        status: status
      });
      return res.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

export default orderService;
