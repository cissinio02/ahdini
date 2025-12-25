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

if (
    !empty($input['first_name']) &&
    !empty($input['last_name']) &&
    !empty($input['email']) &&
    !empty($input['password'])
) {
    $database = new Database();
    $db = $database->getConnection();

    $auth = new AuthController($db);
    $result = $auth->register($input);

    if ($result['status'] === 'success') {
        http_response_code(201); // Created
    } else {
        http_response_code(400); // Bad Request
    }
    echo json_encode($result);
    exit();
} else {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'error',
        'message' => 'first_name, last_name, email and password are required.'
    ]);
    exit();
}
 


