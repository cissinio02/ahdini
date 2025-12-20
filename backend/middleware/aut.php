<?php
 
 
    //Middleware to check if user is authenticated
 function checkAuth(){
    //check if session is started
   if(session_status() == PHP_SESSION_NONE){
        session_start();
    }
   
    if(!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true){
        http_response_code(401);//Unauthorized
        echo json_encode([
            "status"=>"error",
            "message"=>"Unauthorized access. Please log in."
        ]);
        exit;
    }

    if($_SESSION['role'] !=='admin'){
        http_response_code(403);//forbiden access
        echo json_encode([
            "status"=>"error",
            "message"=>"Forbidden access. Admins only." 
        ]);
        exit();
    }
 }