<?php

// 1. Middleware to check if user is authenticated
function checkAuth() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
        http_response_code(401); // Unauthorized
        echo json_encode([
            "status" => "error",
            "message" => "Unauthorized access. Please log in."
        ]);
        exit;
    }
}
// 2. Middleware to check if user is Admin
function checkAdmin() {
    
    checkAuth();

    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403); // Forbidden access
        echo json_encode([
            "status" => "error",
            "message" => "Forbidden access. Admins only."
        ]);
        exit();
    }
}

// 3. Middleware to check if user is Vendor (or Admin)
function checkVendor() {
    // First, ensure the user is authenticated
    checkAuth();

    // Then check if the user has the 'vendor' role (or admin)
    if (!isset($_SESSION['role']) || ($_SESSION['role'] !== 'vendor' && $_SESSION['role'] !== 'admin')) {
        http_response_code(403); // Forbidden access
        echo json_encode([
            "status" => "error",
            "message" => "Forbidden access. Vendors only."
        ]);
        exit();
    }
}
?>

