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

}

public function addGift(){
      checkAuth();  //check if user is authenticated do not remove it ****** security ******


}


}