<?php
 class User{
    private $db;
    public function __construct($db){
        $this->db =$db;//initialize database connection
    }

    //check if email exists
    public function emailExists($email){
        $stmt = $this->db->prepare(
            "SELECT id FROM users WHERE email= ?"
        );
        $stmt->execute([$email]);
        return $stmt->fetch() !==false;
    }
    
    //create new user
    public function create($first, $last, $email, $password){
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)"
        
        );
        return $stmt->execute([
            $first,
            $last,
            $email,
            $hashed
        ]);
    }
//get user by email
    public function getUserByEmail($email){
        $stmt =$this->db->prepare("SELECT * FROM users WHERE email=?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO:: FETCH_ASSOC); //return associative array (return user data if found)
    }
        
 }

