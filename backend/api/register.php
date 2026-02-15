<?php
// CORS: allowlist specific localhost dev origins (add ports as needed)
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Vary: Origin');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php'; // import Database connection
require_once __DIR__ . '/../controllers/AuthController.php'; // import AuthController

// read raw body and parse JSON
$rawBody = file_get_contents('php://input');
$input = json_decode($rawBody, true); // get JSON input data

// Log request for debugging (development only)
$logEntry = [
    'time' => date('Y-m-d H:i:s'),
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? '',
    'method' => $_SERVER['REQUEST_METHOD'] ?? '',
    'raw' => $rawBody,
    'parsed' => $input,
];

@file_put_contents(__DIR__ . '/../log.txt', json_encode($logEntry) . PHP_EOL, FILE_APPEND);//suppress errors

// Normalize keys: accept camelCase or snake_case from frontend
$normalized = [];
if (is_array($input)) {
    foreach ($input as $k => $v) {
        // convert camelCase to snake_case for known keys
        $snake = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $k));
        $normalized[$snake] = $v;
        $normalized[$k] = $v; // keep original as well
    }
}

$database = new Database();
$db = $database->getConnection();
$auth = new AuthController($db);

// Decide whether this is vendor registration (presence of shop fields) or client
$isVendor = !empty($normalized['shopname']) || !empty($normalized['shop_phone']) || !empty($normalized['shopPhone']) || !empty($normalized['shopLocation']);

if ($isVendor) {
    // vendor required fields - check for both camelCase and snake_case versions
    $required = ['first_name','last_name','email','password','shop_name','shop_phone','shop_location'];
    $missing = [];
    foreach ($required as $r) {
        if (empty($normalized[$r])) $missing[] = $r;
    }
    if (!empty($missing)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required vendor fields', 'missing' => $missing]);
        exit();
    }

    // Call vendor registration method (expects camelCase keys as implemented)
    $result = $auth->registerVendor($input);
    if ($result['status'] === 'success') http_response_code(201);
    else http_response_code(400);
    echo json_encode($result);
    exit();
} else {
    // client required fields (accept either first_name or firstName keys)
    $first = $normalized['first_name'] ?? $normalized['firstName'] ?? '';
    $last = $normalized['last_name'] ?? $normalized['lastName'] ?? '';
    $email = $normalized['email'] ?? '';
    $password = $normalized['password'] ?? '';

    if (empty($first) || empty($last) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'first_name, last_name, email and password are required.']);
        exit();
    }

    // normalize into snake_case as register() expects
    $clientInput = [
        'first_name' => $first,
        'last_name' => $last,
        'email' => $email,
        'password' => $password,
    ];

    $result = $auth->register($clientInput);
    if ($result['status'] === 'success') http_response_code(201);
    else http_response_code(400);
    echo json_encode($result);
    exit();
}
 


