<?php
header('Content-Type: application/json');

// Handle CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Credentials: true");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start session
session_start();

// Include database and models
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/notification.php';

$action = $_GET['action'] ?? '';

try {
    // Verify vendor role
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'vendor') {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        exit;
    }

    $database = new Database();
    $db = $database->connect();
    $notification = new Notification($db);

    switch ($action) {
        case 'get_unread':
            $notifications = $notification->getUnreadNotifications($_SESSION['user_id']);
            echo json_encode([
                'success' => true,
                'notifications' => $notifications ?? [],
                'count' => count($notifications ?? [])
            ]);
            break;
        
        case 'get_count':
            $count = $notification->getUnreadCount($_SESSION['user_id']);
            echo json_encode([
                'success' => true,
                'count' => $count
            ]);
            break;
        
        case 'mark_read':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Missing notification ID']);
                exit;
            }
            
            if ($notification->markAsRead($_GET['id'])) {
                echo json_encode(['success' => true, 'message' => 'Marked as read']);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Failed to mark as read']);
            }
            break;
        
        case 'mark_all_read':
            if ($notification->markAllAsRead($_SESSION['user_id'])) {
                echo json_encode(['success' => true, 'message' => 'All marked as read']);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Failed to mark all as read']);
            }
            break;
        
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Unknown action']);
            break;
    }
} catch (Exception $e) {
    error_log("Notifications API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>
