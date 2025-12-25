<?php
header('access-control-allow-origin: http://localhost:5173');//allow requests from frontend
header('access-control-allow-credentials: true');//allow cookies
header('content-type: application/json');//response type
require_once __DIR__ . '/../controllers/AuthController.php'; //import AuthController

if(session_status() == PHP_SESSION_NONE){
    session_start();
}
$_SESSION= array();//clear all session data
session_destroy();//destroy the session
echo json_encode([
    "status"=>"success",
    "message"=>"you have been logged out successfully"
]);