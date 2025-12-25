<?php
require_once __DIR__ . '/../middleware/auth.php'; //import authentication middleware
require_once __DIR__ . '/../models/gift.php';//import User model

class GiftController{
    private $giftModel;
    //initialize Gift model
    public function __construct($db){
        $this->giftModel=new Gift($db);
    }

    public function listGifts(){
      //call model and return JSON response
        $gifts=$this->giftModel->getAll();
        echo json_encode ([
            "status"=>"success",
            "data"=>$gifts
        ]);
}

public function addGift(){
      checkAuth();  //check if user is authenticated do not remove it ****** security ******
        $data=json_decode(file_get_contents("php://input"),true);
        $result=$this->giftModel->create($data);
        if($result){
            echo json_encode ([
                "status"=>"success",
                "message"=>"Gift added successfully"
            ]);
        }else{
            echo json_encode ([
                "status"=>"error",
                "message"=>"Failed to add gift"
            ]);
        }
}
}