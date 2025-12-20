<?php

require_once __DIR__ . '/../models/User.php';//import User model
require_once __DIR__ . '/../config/database.php';//import database connection

class AuthController {//controller for authentication
    //initialize User model
    private $user;
    public function __construct($db){
        $this->user =new User($db);
    }
    
    //user registration
    public function register (){
        $data = json_decode(file_get_contents("php://input"),true);//get JSON input data
        
    //secure registeration
    
    //validate input
        if (
            empty ($data ['first_name'])||
            empty ($data ['last_name'])||
            empty ($data ['email'])||
            empty ($data ['password'])

        ){
            echo json_encode([
                "status"=>"error",
                "message"=>"All fields are required"
            ]);
            return;
        }
      //validate email format
        if (!filter_var($data['email
        '], FILTER_VALIDATE_EMAIL)){
            echo json_encode ([
                "status"=>"error",
                "message"=>"Invalide email format"
            ]);
        }

//validate password length
if (strlen ($data['password)']) <8){
    echo json_encode([
        "status"=>"error",
        "message"=> "password must be at least 8 characters long" 
    ]);
}
//check if email already exists

        if ($this->user->emailExists($data['email'])){
            echo json_encode  ([
                "status"=>"error",
                "message"=>"Email already exists"
            ]);
            return;
        }

        $this->user->create(
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['password']
        );
        echo json_encode ([
            "status" => "success",
            "message"=>"user registered succesfully"
        ]);
    }

    //login user
public function login(){
    $data = json_decode(file_get_contents("php://input"),true) ;

    if (
        empty ($data ['email'])||
        empty ($data['password'])
    ){
        echo json_encode([
            "status "=>"error",
            "message"=>"please provide email and password"
        ]);

        return;
    }

    //verify user credentials
    $userRecord =$this->user->getUserByEmail($data['email']);
    if($userRecord && password_verify($data['password'], $userRecord['password'])){
        echo json_encode ([
            "status"=>"success",
            "message"=>"your are loged in successfully",
        
            "user"=>[
'id'=>$userRecord['id'],
'name'=>$userRecord['first_name']. " ".$userRecord['last_name']
        ]
        ]);

        
    }else{
        echo json_encode ([
            "status"=>"error",
            "message"=>"Invalid email or password"
        ]);
    }
}
if (userRecord && password_verify($data['password'], $userRecord['password'])){
    $_SESSION['user_id'] = $userRecord['id'];
    $_SESSION['eamail'] = $userRecord['email'];
    $_SESSION['is_logged_in'] = true;

    echo json_encode([
        "status"=>"succes",
        "message"=>"you are logged in successfully",
    ])
}

//logout user
public function logout(){
    session_unset();//remove all session variables
    session_destroy();//destroy the session
    echo json_encode([
        "status"=>"success",
        "message"=>"you have been logged out successfully"
    ]);
}
}