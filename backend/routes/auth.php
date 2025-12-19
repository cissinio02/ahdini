<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$pdo = $database->getConnection();
$controller = new AuthController($pdo);
$action = $_GET['action'] ?? '';
if ($action ==='register'){
    $controller->register();
} else {
    echo json_encode ([
        "status"=>"error",
        "message"=>"Invalid action"
    ]);
}