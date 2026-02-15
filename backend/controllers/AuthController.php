<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/database.php';

class AuthController {
    private $user;
    
    public function __construct($db){
        $this->user = new User($db);
    }
    
    // Register a new client
    public function register($data = null){
        if ($data === null) {
            $data = json_decode(file_get_contents("php://input"), true);
        }

        // Validate required fields
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

        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)){
            return [
                'status' => 'error',
                'message' => 'Invalid email format',
                'errors' => ['email' => 'Invalid email format']
            ];
        }

        // Validate password length
        if (strlen($data['password']) < 8) {
            return [
                'status' => 'error',
                'message' => 'Password too short',
                'errors' => ['password' => 'Password must be at least 8 characters long']
            ];
        }

        // Validate uppercase letter
        if (!preg_match('/[A-Z]/', $data['password'])) {
            return [
                'status' => 'error',
                'message' => 'Weak password',
                'errors' => ['password' => 'Password must contain at least one uppercase letter']
            ];
        }

        // Validate number
        if (!preg_match('/[0-9]/', $data['password'])) {
            return [
                'status' => 'error',
                'message' => 'Weak password',
                'errors' => ['password' => 'Password must contain at least one number']
            ];
        }

        // Validate special character
        if (!preg_match('/[\\W]/', $data['password'])) {
            return [
                'status' => 'error',
                'message' => 'Weak password',
                'errors' => ['password' => 'Password must contain at least one special character']
            ];
        }

        // Check if email already exists
        if ($this->user->emailExists($data['email'])){
            return [
                'status' => 'error',
                'message' => 'Email already exists',
                'errors' => ['email' => 'Email already exists']
            ];
        }

        $this->user->createClient(
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['password']
        );
        
        return [
            "status" => "success",
            "message" => "User registered successfully"
        ];
    }

    // Register a vendor
    public function registerVendor($data = null) {
        if ($data === null) {
            $data = json_decode(file_get_contents("php://input"), true);
        }

        // Normalize keys - accept both camelCase and snake_case
        $normalized = [];
        foreach ($data as $k => $v) {
            $normalized[strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $k))] = $v;
            $normalized[$k] = $v;
        }

        // Map variations to standard names
        $firstName = $normalized['first_name'] ?? $normalized['firstName'] ?? '';
        $lastName = $normalized['last_name'] ?? $normalized['lastName'] ?? '';
        $email = $normalized['email'] ?? '';
        $password = $normalized['password'] ?? '';
        $shopName = $normalized['shop_name'] ?? $normalized['shopname'] ?? $normalized['shopName'] ?? '';
        $shopPhone = $normalized['shop_phone'] ?? $normalized['shopphone'] ?? $normalized['shopPhone'] ?? '';
        $shopLocation = $normalized['shop_location'] ?? $normalized['shoplocation'] ?? $normalized['shopLocation'] ?? '';

        // Validate mandatory fields
        $errors = [];
        if (empty($firstName)) $errors['firstName'] = 'First name is required';
        if (empty($lastName)) $errors['lastName'] = 'Last name is required';
        if (empty($email)) $errors['email'] = 'Email is required';
        if (empty($password)) $errors['password'] = 'Password is required';
        if (empty($shopName)) $errors['shopName'] = 'Shop name is required';
        if (empty($shopPhone)) $errors['shopPhone'] = 'Shop phone is required';
        if (empty($shopLocation)) $errors['shopLocation'] = 'Shop location is required';

        if (!empty($errors)) {
            return [
                "status" => "error",
                "message" => "Please fill all required fields.",
                "errors" => $errors
            ];
        }

        // Check for unique email
        if ($this->user->emailExists($email)) {
            return [
                "status" => "error",
                "message" => "This email is already in use.",
                "errors" => ['email' => 'Email already exists']
            ];
        }

        // Check for unique phone
        if ($this->user->phoneExists($shopPhone)) {
            return [
                "status" => "error",
                "message" => "This phone number is already registered to a shop.",
                "errors" => ['shopPhone' => 'Phone already in use']
            ];
        }

        // Create user account first
        $userId = $this->user->createVendor($firstName, $lastName, $email, $password, $shopName, $shopPhone, $shopLocation);
        
        if ($userId) {
            return [
                "status" => "success",
                "message" => "Vendor registered successfully. Awaiting admin approval.",
                "user_id" => $userId
            ];
        } else {
            return [
                "status" => "error",
                "message" => "Failed to register vendor"
            ];
        }
    }

    // Login user
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
                "message" => "Please provide email and password"
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
            $_SESSION['role'] = $userRecord['role'] ?? 'client';

            return [
                "status" => "success",
                "message" => "You are logged in successfully",
                "user" => [
                    'id' => $userRecord['id'],
                    'name' => $userRecord['first_name'] . " " . $userRecord['last_name'],
                    'role' => $userRecord['role'] ?? 'client'
                ]
            ];
        } else {
            return [
                "status" => "error",
                "message" => "Invalid email or password"
            ];
        }
    }

    // Logout user
    public function logout(){
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        session_unset();
        session_destroy();

        return [
            "status" => "success",
            "message" => "You have been logged out successfully"
        ];
    }
}