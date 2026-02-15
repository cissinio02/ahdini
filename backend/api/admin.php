<?php
// CORS headers - allow any localhost port
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Vary: Origin');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents('php://input'), true);

// Get action from query parameter
$action = isset($_GET['action']) ? $_GET['action'] : 'register';

if ($action === 'check_admin_exists') {
    // Check if any admin exists
    $stmt = $db->prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    $stmt->execute();
    $adminExists = $stmt->fetch() !== false;
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'adminExists' => $adminExists
    ]);
    exit();
}

if ($action === 'create_admin') {
    // First, check if admin already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    $stmt->execute();
    if ($stmt->fetch() !== false) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Admin account already exists. Contact system administrator.'
        ]);
        exit();
    }

    // Validate required fields
    if (empty($input['first_name']) || empty($input['last_name']) || empty($input['email']) || empty($input['password'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'All fields are required.'
        ]);
        exit();
    }

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email format.',
            'errors' => ['email' => 'Invalid email format']
        ]);
        exit();
    }

    // Validate password strength
    $password = $input['password'];
    $errors = [];
    
    if (strlen($password) < 8) {
        $errors['password'] = 'Password must be at least 8 characters long';
    }
    if (!preg_match('/[A-Z]/', $password)) {
        $errors['password'] = 'Password must contain at least one uppercase letter';
    }
    if (!preg_match('/[0-9]/', $password)) {
        $errors['password'] = 'Password must contain at least one number';
    }
    if (!preg_match('/[\\W]/', $password)) {
        $errors['password'] = 'Password must contain at least one special character';
    }

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Password does not meet requirements',
            'errors' => $errors
        ]);
        exit();
    }

    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$input['email']]);
    if ($stmt->fetch() !== false) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email already exists',
            'errors' => ['email' => 'Email already exists']
        ]);
        exit();
    }

    // Create admin account
    $hashed = password_hash($input['password'], PASSWORD_DEFAULT);
    $stmt = $db->prepare(
        "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, 'admin')"
    );
    
    if ($stmt->execute([$input['first_name'], $input['last_name'], $input['email'], $hashed])) {
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Admin account created successfully. You can now log in.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create admin account'
        ]);
    }
    exit();
}

// Get pending vendors (vendors with role='vendor' but status='pending')
if ($action === 'get_pending_vendors') {
    $stmt = $db->prepare(
        "SELECT u.id, u.first_name, u.last_name, u.email, u.created_at 
         FROM users u
         LEFT JOIN vendor v ON u.id = v.user_id
         WHERE u.role = 'vendor' AND (v.id IS NULL OR v.is_active = 0)
         ORDER BY u.created_at DESC"
    );
    $stmt->execute();
    $vendors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $vendors
    ]);
    exit();
}

// Get pending products
if ($action === 'get_pending_products') {
    $stmt = $db->prepare(
        "SELECT g.id, g.title, g.description, g.price, g.category, g.image, g.vendor_id, 
                u.first_name, u.last_name
         FROM gifts g
         JOIN users u ON g.vendor_id = u.id
         WHERE g.status = 'pending'
         ORDER BY g.created_at DESC"
    );
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $products
    ]);
    exit();
}

// Get active vendors
if ($action === 'get_active_vendors') {
    $stmt = $db->prepare(
        "SELECT u.id, u.first_name, u.last_name, u.email, u.created_at,
                COUNT(g.id) as products,
                COALESCE(AVG(o.rating), 0) as rating,
                v.is_active as status
         FROM users u
         JOIN vendor v ON u.id = v.user_id
         LEFT JOIN gift g ON u.id = g.vendor_id
         LEFT JOIN orders o ON u.id = o.vendor_id
         WHERE u.role = 'vendor' AND v.is_active = 1
         GROUP BY u.id
         ORDER BY u.created_at DESC"
    );
    $stmt->execute();
    $vendors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => $vendors
    ]);
    exit();
}

// Get admin stats
if ($action === 'get_stats') {
    // Total vendors
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'vendor'");
    $stmt->execute();
    $totalVendors = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // New vendors this month
    $stmt = $db->prepare(
        "SELECT COUNT(*) as count FROM users 
         WHERE role = 'vendor' AND MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())"
    );
    $stmt->execute();
    $newVendorsMonth = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Total products
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM gifts WHERE status = 'approved'");
    $stmt->execute();
    $totalProducts = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Pending products
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM gifts WHERE status = 'pending'");
    $stmt->execute();
    $pendingProducts = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Pending vendors
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'vendor' AND status = 'pending'");
    $stmt->execute();
    $pendingVendors = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => [
            'totalVendors' => (int)$totalVendors,
            'newVendorsThisMonth' => (int)$newVendorsMonth,
            'marketplaceProducts' => (int)$totalProducts,
            'productsAwaitingApproval' => (int)$pendingProducts,
            'pendingVendorRequests' => (int)$pendingVendors
        ]
    ]);
    exit();
}

// Approve vendor
if ($action === 'approve_vendor') {
    if (empty($input['vendor_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Vendor ID required']);
        exit();
    }
    
    $stmt = $db->prepare("UPDATE vendor SET is_active = 1 WHERE user_id = ?");
    if ($stmt->execute([$input['vendor_id']])) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Vendor approved']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to approve vendor']);
    }
    exit();
}

// Reject vendor
if ($action === 'reject_vendor') {
    if (empty($input['vendor_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Vendor ID required']);
        exit();
    }
    
    $stmt = $db->prepare("DELETE FROM vendor WHERE user_id = ?");
    if ($stmt->execute([$input['vendor_id']])) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Vendor rejected']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to reject vendor']);
    }
    exit();
}

// Approve product
if ($action === 'approve_product') {
    if (empty($input['product_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Product ID required']);
        exit();
    }
    
    $stmt = $db->prepare("UPDATE gifts SET status = 'approved' WHERE id = ?");
    if ($stmt->execute([$input['product_id']])) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Product approved']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to approve product']);
    }
    exit();
}

// Reject product
if ($action === 'reject_product') {
    if (empty($input['product_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Product ID required']);
        exit();
    }
    
    $stmt = $db->prepare("UPDATE gifts SET status = 'rejected' WHERE id = ?");
    if ($stmt->execute([$input['product_id']])) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Product rejected']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to reject product']);
    }
    exit();
}

// Ban vendor
if ($action === 'ban_vendor') {
    if (empty($input['vendor_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Vendor ID required']);
        exit();
    }
    
    $stmt = $db->prepare("UPDATE users SET status = 'banned' WHERE id = ? AND role = 'vendor'");
    if ($stmt->execute([$input['vendor_id']])) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Vendor banned']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to ban vendor']);
    }
    exit();
}

// Default action or other actions
http_response_code(400);
echo json_encode([
    'status' => 'error',
    'message' => 'Invalid action'
]);
