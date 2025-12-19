<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/database.php';

class AuthController {
    private $user;
    public function __construct($db){
        $this->user =new User($db);
    }
    public function register (){
        $data = json_decode(file_get_contents("php://input"),true);
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

        if ($this->user->emailExists($data['email'])){
            echo json_encode ([
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
}