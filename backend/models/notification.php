<?php

class Notification {
    private $conn;
    private $table = 'vendor_notifications';

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get unread notifications for a vendor
     */
    public function getUnreadNotifications($vendor_id) {
        $query = "SELECT vn.*, o.id as order_id, o.delivery_date, o.quantity,
                         g.title as gift_title, g.image, u.first_name, u.last_name
                  FROM " . $this->table . " vn
                  JOIN orders o ON vn.order_id = o.id
                  JOIN gift g ON o.gift_id = g.id
                  JOIN users u ON o.user_id = u.id
                  WHERE vn.vendor_id = :vendor_id
                  AND vn.is_read = 0
                  ORDER BY vn.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':vendor_id', $vendor_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return false;
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($notification_id) {
        $query = "UPDATE " . $this->table . " 
                  SET is_read = 1 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $notification_id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    /**
     * Mark all vendor notifications as read
     */
    public function markAllAsRead($vendor_id) {
        $query = "UPDATE " . $this->table . " 
                  SET is_read = 1 
                  WHERE vendor_id = :vendor_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':vendor_id', $vendor_id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    /**
     * Get unread count for vendor
     */
    public function getUnreadCount($vendor_id) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table . " 
                  WHERE vendor_id = :vendor_id AND is_read = 0";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':vendor_id', $vendor_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['count'] ?? 0;
        }
        return 0;
    }

    /**
     * Delete notification
     */
    public function delete($notification_id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $notification_id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }
}
?>
