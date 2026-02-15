import api from '../api/axios';

const notificationService = {
  // Get all unread notifications
  getUnreadNotifications: async () => {
    try {
      const res = await api.get('notifications.php?action=get_unread');
      return res.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const res = await api.get('notifications.php?action=get_count');
      return res.data;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      throw error;
    }
  },

  // Mark single notification as read
  markAsRead: async (notificationId) => {
    try {
      const res = await api.get(`notifications.php?action=mark_read&id=${notificationId}`);
      return res.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const res = await api.get('notifications.php?action=mark_all_read');
      return res.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }
};

export default notificationService;
