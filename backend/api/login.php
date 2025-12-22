<?php
file_put_contents('log.txt', "file called at " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

header('access-control-allow-origin: http://localhost:5173');//allow requests from frontend
header('access-control-allow-credentials: true');//allow cookies
header('access-control-allow-methods: POST, OPTIONS');//allowed methods
header('access-control-allow-headers: Content-Type');//allowed headers
header('content-type: application/json');//response type



require_once __DIR__ . '/../controllers/AuthController.php'; //import AuthController

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents('php://input'), true);//get JSON input data

if(isset($input['email']) && isset($input['password'])){

    $auth = new AuthController($db);
    $result = $auth->login($input['email'], $input['password']);
    echo json_encode($result);
} else {
    http_response_code(400); // Bad Request 
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required."
    ]);

}