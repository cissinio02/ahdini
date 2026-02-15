<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('access-control-allow-credentials: true');//allow cookies
header('content-type: application/json');//response type

require_once __DIR__ . '/../middleware/auth.php'; //import AuthController

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

if (!isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true) {
        echo json_encode([
            "isLoggedIn" => "true",
            "user" => [
                "first_name" => $_SESSION['first_name'] ?? '',
                "last_name" => $_SESSION['last_name'] ?? '',
                "role" => $_SESSION['role']
            ]
        ]);
} else {
    http_response_code(401); // Unauthorized
    echo json_encode([
        "isLoggedIn" => "false",
        "message" => "Not authenticated."
    ]);
    }