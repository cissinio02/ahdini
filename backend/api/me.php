<?php
header('access-control-allow-origin: http://localhost:3000');//allow requests from frontend
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