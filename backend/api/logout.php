<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
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