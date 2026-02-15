<?php
require_once __DIR__ . '/../middleware/aut.php'; 
require_once __DIR__ . '/../models/gift.php';

class GiftController {
    private $giftModel;

    public function __construct($db) {
        $this->giftModel = new Gift($db);
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
      checkAdmin();  //check if user is authenticated do not remove it ****** security ******
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

public function deleteGift($id){
      checkAdmin();
        $result=$this->giftModel->delete($id);
        if($result){
            echo json_encode ([
                "status"=>"success",
                "message"=>"Gift deleted successfully"
            ]);
        }else{
            echo json_encode ([
                "status"=>"error",
                "message"=>"Failed to delete gift"
            ]);
        }
}
public function updateGift($id){
      checkAdmin();
        $data=json_decode(file_get_contents("php://input"),true);
        $result=$this->giftModel->update($id, $data);
        if($result){
            echo json_encode ([
                "status"=>"success",
                "message"=>"Gift updated successfully"
            ]);
        }else{
            echo json_encode ([
                "status"=>"error",
                "message"=>"Failed to update gift"
            ]);
        }
    }
}