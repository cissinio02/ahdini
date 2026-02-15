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
require_once __DIR__ . '/../models/order.php';
require_once __DIR__ . '/../middleware/aut.php';

$action = $_GET['action'] ?? '';
$response = ['success' => false, 'message' => 'Invalid action'];

try {
    $database = new Database();
    $db = $database->connect();
    $order = new Order($db);

    switch ($action) {
        case 'create_order':
            handleCreateOrder($order);
            break;
        
        case 'get_client_orders':
            handleGetClientOrders($order);
            break;
        
        case 'get_vendor_orders':
            handleGetVendorOrders($order);
            break;
        
        case 'get_vendor_pending':
            handleGetVendorPending($order);
            break;
        
        case 'update_order_status':
            handleUpdateOrderStatus($order);
            break;
        
        case 'get_order':
            handleGetOrder($order);
            break;
        
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Unknown action']);
            break;
    }
} catch (Exception $e) {
    error_log("Orders API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

// ===== HANDLERS =====

function handleCreateOrder($order) {
    // Verify user is authenticated
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        return;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required fields
    $required = ['vendor_id', 'gift_id', 'quantity', 'price_at_sale', 'delivery_date'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
            return;
        }
    }

    // Validate delivery date is in future
    $delivery_date = new DateTime($data['delivery_date']);
    $today = new DateTime();
    if ($delivery_date < $today) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Delivery date must be in the future']);
        return;
    }

    // Max 3 months in advance
    $max_date = new DateTime('+90 days');
    if ($delivery_date > $max_date) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Cannot schedule more than 90 days ahead']);
        return;
    }

    $result = $order->create(
        $_SESSION['user_id'],
        $data['vendor_id'],
        $data['gift_id'],
        $data['quantity'],
        $data['price_at_sale'],
        $data['delivery_date'],
        $data['card_id'] ?? null,
        $data['message_text'] ?? null
    );

    if ($result) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Order placed successfully',
            'order' => $result
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Failed to create order']);
    }
}

function handleGetClientOrders($order) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        return;
    }

    $orders = $order->getByClient($_SESSION['user_id']);

    echo json_encode([
        'success' => true,
        'orders' => $orders ?? []
    ]);
}

function handleGetVendorOrders($order) {
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'vendor') {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        return;
    }

    $orders = $order->getByVendor($_SESSION['user_id']);

    echo json_encode([
        'success' => true,
        'orders' => $orders ?? []
    ]);
}

function handleGetVendorPending($order) {
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'vendor') {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        return;
    }

    $orders = $order->getVendorPendingOrders($_SESSION['user_id']);

    echo json_encode([
        'success' => true,
        'pending_orders' => $orders ?? []
    ]);
}

function handleUpdateOrderStatus($order) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        return;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['order_id']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing order_id or status']);
        return;
    }

    $valid_statuses = ['scheduled', 'preparing', 'ready_for_pickup', 'in_transit', 'delivered', 'cancelled'];
    if (!in_array($data['status'], $valid_statuses)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid status']);
        return;
    }

    if ($order->updateStatus($data['order_id'], $data['status'])) {
        echo json_encode(['success' => true, 'message' => 'Order status updated']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Failed to update status']);
    }
}

function handleGetOrder($order) {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing order ID']);
        return;
    }

    $result = $order->getById($_GET['id']);

    if ($result) {
        echo json_encode(['success' => true, 'order' => $result]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order not found']);
    }
}
?>
