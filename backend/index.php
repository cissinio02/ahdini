<?php 
header("Content-Type: application/json; charset=UTF-8");
require_once 'config/database.php';
echo json_encode([
    "status" => "ok",
    "message" => "API is ahdini works!",
]);