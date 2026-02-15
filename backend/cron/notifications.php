<?php
/**
 * Ahdini Cron Job - Notification System
 * 
 * This script should be scheduled to run daily (ideally at 6 AM)
 * It sends email reminders to vendors for orders due for pickup
 * 
 * To schedule with crontab:
 * 0 6 * * * php /path/to/ahdini/backend/cron/notifications.php
 * 
 * Or call via curl (if hosting provider blocks cron):
 * 0 6 * * * curl -s http://your-site.com/backend/cron/notifications.php
 */

// Prevent direct web access (optional, for security)
if (php_sapi_name() !== 'cli' && !isset($_GET['key']) || $_GET['key'] !== getenv('CRON_SECRET_KEY')) {
    http_response_code(403);
    exit('Not allowed');
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/order.php';
require_once __DIR__ . '/../config/mail.php';

try {
    $database = new Database();
    $db = $database->connect();
    $order = new Order($db);

    // Get all orders due for pickup today
    $orders_due = $order->getOrdersDueForPickup();

    if ($orders_due && count($orders_due) > 0) {
        // Send emails to vendors
        foreach ($orders_due as $order_item) {
            sendPickupReminderEmail(
                $order_item['vendor_id'],
                $order_item['id'],
                $order_item['delivery_date']
            );
        }

        $log_message = date('Y-m-d H:i:s') . " - Sent reminders for " . count($orders_due) . " orders\n";
    } else {
        $log_message = date('Y-m-d H:i:s') . " - No orders due for pickup today\n";
    }

    // Log execution
    file_put_contents(__DIR__ . '/../logs/cron.log', $log_message, FILE_APPEND);
    echo $log_message;

} catch (Exception $e) {
    error_log("Cron error: " . $e->getMessage());
    file_put_contents(__DIR__ . '/../logs/cron_error.log', 
        date('Y-m-d H:i:s') . " - " . $e->getMessage() . "\n", 
        FILE_APPEND);
    http_response_code(500);
    exit('Cron error');
}

function sendPickupReminderEmail($vendor_id, $order_id, $delivery_date) {
    // This would integrate with your mail config
    // Example using mail() function
    
    // Get vendor email from database would go here
    // For now, this is a placeholder
    
    $subject = "Pickup Reminder - Order #$order_id";
    $message = "Hello,\n\n";
    $message .= "Your order #$order_id is ready for Ahdini pickup today!\n";
    $message .= "Delivery date: " . date('M d, Y', strtotime($delivery_date)) . "\n\n";
    $message .= "Please ensure the gift is properly wrapped and ready.\n";
    $message .= "Visit your dashboard to update the order status.\n\n";
    $message .= "Best regards,\n";
    $message .= "Ahdini Team";

    // mail($vendor_email, $subject, $message, "From: noreply@ahdini.com");
}
?>
