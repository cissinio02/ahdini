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
    public function register ($data = null){
        if ($data === null) {
            $data = json_decode(file_get_contents("php://input"), true); // get JSON input data
        }
        
    //secure registeration
    
    //validate input
        // Validate required fields and collect field-specific errors
        $errors = [];
        if (empty($data['first_name'])) $errors['first_name'] = 'First name is required';
        if (empty($data['last_name'])) $errors['last_name'] = 'Last name is required';
        if (empty($data['email'])) $errors['email'] = 'Email is required';
        if (empty($data['password'])) $errors['password'] = 'Password is required';

        if (!empty($errors)) {
            return [
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $errors
            ];
        }
      //validate email format
                if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)){
                    return [
                                'status'=>'error',
                                'message'=>'Invalid email format',
                                'errors' => ['email' => 'Invalid email format']
                        ];
                }

//validate password length
if (strlen($data['password']) < 8) {
    return [
        'status' => 'error',
        'message' => 'Password too short',
        'errors' => ['password' => 'Password must be at least 8 characters long']
    ];
}

if (!preg_match('/[A-Z]/', $data['password'])) {
    return [
        'status' => 'error',
        'message' => 'Weak password',
        'errors' => ['password' => 'Password must contain at least one uppercase letter']
    ];
}

if (!preg_match('/[0-9]/', $data['password'])) {
    return [
        'status' => 'error',
        'message' => 'Weak password',
        'errors' => ['password' => 'Password must contain at least one number']
    ];
}

if (!preg_match('/[\\W]/', $data['password'])) {
    return [
        'status' => 'error',
        'message' => 'Weak password',
        'errors' => ['password' => 'Password must contain at least one special character']
    ];
}
//check if email already exists

        if ($this->user->emailExists($data['email'])){
            return [
                'status'=>'error',
                'message'=>'Email already exists',
                'errors' => ['email' => 'Email already exists']
            ];
        }

        $this->user->create(
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['password']
        );
        return [
            "status" => "success",
            "message"=>"user registered succesfully"
        ];
    }

    //login user
public function login($email = null, $password = null){
    if ($email !== null && $password !== null) {
        $data = [
            'email' => $email,
            'password' => $password
        ];
    } else {
        $data = json_decode(file_get_contents("php://input"), true);
    }

    if (empty($data['email']) || empty($data['password'])) {
        return [
            "status" => "error",
            "message" => "please provide email and password"
        ];
    }

    $userRecord = $this->user->getUserByEmail($data['email']);
    if ($userRecord && password_verify($data['password'], $userRecord['password'])) {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        session_regenerate_id(true);
        $_SESSION['user_id'] = $userRecord['id'];
        $_SESSION['email'] = $userRecord['email'];
        $_SESSION['is_logged_in'] = true;
        $_SESSION['role'] = $userRecord['role'] ?? 'user';

        return [
            "status" => "success",
            "message" => "you are logged in successfully",
            "user" => [
                'id' => $userRecord['id'],
                'name' => $userRecord['first_name'] . " " . $userRecord['last_name']
            ]
        ];
    } else {
        return [
            "status" => "error",
            "message" => "Invalid email or password"
        ];
    }
}


//logout user
public function logout(){
     if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
    session_unset();//remove all session variables
    session_destroy();//destroy the session

    return [
        "status"=>"success",
        "message"=>"you have been logged out successfully . No redirect page found yet "
    ];
}
}