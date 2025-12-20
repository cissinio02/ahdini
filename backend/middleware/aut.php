<?php
 
 
    //Middleware to check if user is authenticated
 function checkAuth(){
    
    if(!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true){
        http_response_code(401);//Unauthorized
        echo json_encode([
            "status"=>"error",
            "message"=>"Unauthorized access. Please log in."
        ]);
        exit;
    }
 }