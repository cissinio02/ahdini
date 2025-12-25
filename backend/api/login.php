<?php
// log the request for debugging
file_put_contents(__DIR__ . '/log.txt', "login.php called at " . date('Y-m-d H:i:s') . " origin=" . ($_SERVER['HTTP_ORIGIN'] ?? 'none') . " method=" . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);

// CORS: allow a whitelist of local dev origins (adjust as needed)
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['email']) && isset($input['password'])) {
    $auth = new AuthController($db);
    $result = $auth->login($input['email'], $input['password']);
    echo json_encode($result);
    exit();
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required."
    ]);
    exit();
}