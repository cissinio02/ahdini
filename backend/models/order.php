<?php

class Order {
    private $conn;
    private $table = 'orders';

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new order
     * @param int $user_id - Client user ID
     * @param int $vendor_id - Vendor ID
     * @param int $gift_id - Gift ID
     * @param int $quantity - Quantity
     * @param float $price_at_sale - Gift price at time of order
     * @param string $delivery_date - Delivery date (Y-m-d)
     * @param string $card_id - Optional card for gift
     * @param string $message_text - Optional message
     * @return array|false - Order data or false on failure
     */
    public function create($user_id, $vendor_id, $gift_id, $quantity, $price_at_sale, $delivery_date, $card_id = null, $message_text = null) {
        try {
            $this->conn->beginTransaction();

            // Calculate commission (10%)
            $total_price = $price_at_sale * $quantity;
            $commission_amount = $total_price * 0.10;

            $query = "INSERT INTO " . $this->table . " 
                      (user_id, vendor_id, gift_id, quantity, price_at_sale, delivery_date, 
                       card_id, message_text, total_price, commission_amount, payment_status, status)
                      VALUES 
                      (:user_id, :vendor_id, :gift_id, :quantity, :price_at_sale, :delivery_date,
                       :card_id, :message_text, :total_price, :commission_amount, 'paid', 'scheduled')";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindParam(':vendor_id', $vendor_id, PDO::PARAM_INT);
            $stmt->bindParam(':gift_id', $gift_id, PDO::PARAM_INT);
            $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
            $stmt->bindParam(':price_at_sale', $price_at_sale);
            $stmt->bindParam(':delivery_date', $delivery_date);
            $stmt->bindParam(':card_id', $card_id, PDO::PARAM_INT);
            $stmt->bindParam(':message_text', $message_text);
            $stmt->bindParam(':total_price', $total_price);
            $stmt->bindParam(':commission_amount', $commission_amount);

            if (!$stmt->execute()) {
                $this->conn->rollBack();
                return false;
            }

            $order_id = $this->conn->lastInsertId();

            // Create notification for vendor (prepare 3 days before delivery)
            $prep_date = date('Y-m-d', strtotime($delivery_date . ' -3 days'));
            $notification_query = "INSERT INTO vendor_notifications 
                                  (vendor_id, order_id, notification_type, preparation_date)
                                  VALUES (:vendor_id, :order_id, 'prepare_order', :prep_date)";
            
            $notif_stmt = $this->conn->prepare($notification_query);
            $notif_stmt->bindParam(':vendor_id', $vendor_id, PDO::PARAM_INT);
            $notif_stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
            $notif_stmt->bindParam(':prep_date', $prep_date);
            
            if (!$notif_stmt->execute()) {
                $this->conn->rollBack();
                return false;
            }

            $this->conn->commit();

            return [
                'id' => $order_id,
                'user_id' => $user_id,
                'vendor_id' => $vendor_id,
                'gift_id' => $gift_id,
                'quantity' => $quantity,
                'total_price' => $total_price,
                'commission_amount' => $commission_amount,
                'delivery_date' => $delivery_date,
                'status' => 'scheduled',
                'payment_status' => 'paid'
            ];

        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log("Order creation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all orders for a vendor
     */
    public function getByVendor($vendor_id) {
        $query = "SELECT o.*, u.first_name, u.last_name, u.phone, g.title, g.image, g.price
                  FROM " . $this->table . " o
                  JOIN users u ON o.user_id = u.id
                  JOIN gift g ON o.gift_id = g.id
                  WHERE o.vendor_id = :vendor_id
                  ORDER BY o.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':vendor_id', $vendor_id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return false;
    }

    /**
     * Get all orders for a client
     */
    public function getByClient($user_id) {
        $query = "SELECT o.*, g.title, g.image, v.shop_name
                  FROM " . $this->table . " o
                  JOIN gift g ON o.gift_id = g.id
                  JOIN vendor v ON o.vendor_id = v.user_id
                  WHERE o.user_id = :user_id
                  ORDER BY o.delivery_date ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return false;
    }

    /**
     * Get single order
     */
    public function getById($order_id) {
        $query = "SELECT o.*, g.title, g.image, u.first_name, u.last_name, v.shop_name
                  FROM " . $this->table . " o
                  JOIN gift g ON o.gift_id = g.id
                  JOIN users u ON o.user_id = u.id
                  JOIN vendor v ON o.vendor_id = v.user_id
                  WHERE o.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $order_id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    /**
     * Update order status
     */
    public function updateStatus($order_id, $status) {
        $query = "UPDATE " . $this->table . " 
                  SET status = :status, updated_at = NOW()
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $order_id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }

    /**
     * Get orders due for pickup (3 days before delivery)
     */
    public function getOrdersDueForPickup() {
        $query = "SELECT o.*, v.user_id as vendor_user_id
                  FROM " . $this->table . " o
                  JOIN vendor v ON o.vendor_id = v.user_id
                  WHERE DATE_SUB(o.delivery_date, INTERVAL 3 DAY) = CURDATE()
                  AND o.status = 'scheduled'";

        $stmt = $this->conn->prepare($query);
        
        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return false;
    }

    /**
     * Get vendor's pending orders awaiting preparation
     */
    public function getVendorPendingOrders($vendor_id) {
        $query = "SELECT o.id, o.quantity, o.delivery_date, o.created_at, 
                         g.title, g.image, u.first_name, u.last_name,
                         vn.preparation_date, vn.is_read
                  FROM " . $this->table . " o
                  JOIN gift g ON o.gift_id = g.id
                  JOIN users u ON o.user_id = u.id
                  JOIN vendor_notifications vn ON o.id = vn.order_id
                  WHERE o.vendor_id = :vendor_id
                  AND o.status = 'scheduled'
                  AND vn.notification_type = 'prepare_order'
                  ORDER BY o.delivery_date ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':vendor_id', $vendor_id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return false;
    }
}
?>
