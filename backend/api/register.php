<?php
header('access-control-allow-origin: http://localhost:3000');//allow requests from frontend
header('access-control-allow-credentials: true');//allow cookies
header('content-type: application/json');//response type


require_once __DIR__ . '/../controllers/AuthController.php'; //import AuthController

$input = json_decode(file_get_contents('php://input'), true);//get JSON input data

if( 
    !empty ($input ['first_name'])&&
            !empty ($input ['last_name'])&&
            !empty ($input ['email'])&&
            !empty ($input ['password'])
){

    $auth = new AuthController();
    $result = $auth->register($input);
    
    if($result['status'] ==='success'){
        http_response_code(201); // Created
    } else {
        http_response_code(400); // Bad Request 
    }   echo json_encode($result);

    else {
    http_response_code(400); // Bad Request 
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required."
    ]);
    }
}


