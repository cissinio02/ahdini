<?php
require_once __DIR__ . '/../middleware/aut.php'; //import authentication middleware
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

    // Get single gift with all details
    public function getGift($id) {
        try {
            // Get gift basic info with vendor
            $gift = $this->giftModel->Read($id);
            
            if (!$gift) {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Gift not found'
                ]);
                return;
            }

            // Get media (images/videos)
            $media = $this->giftModel->getMedia($id);
            
            // Get reviews
            $reviews = $this->giftModel->getReviews($id);
            
            // Get rating stats
            $ratingStats = $this->giftModel->getRatingStats($id);

            // Combine all data
            $gift['media'] = $media;
            $gift['reviews'] = $reviews;
            $gift['rating'] = $ratingStats['average_rating'] ? round($ratingStats['average_rating'], 1) : 0;
            $gift['review_count'] = $ratingStats['review_count'];

            // Create vendor object
            if ($gift['vendor_name']) {
                $gift['vendor'] = [
                    'name' => $gift['vendor_name'],
                    'logo' => $gift['vendor_logo'],
                    'first_name' => $gift['vendor_first_name'],
                    'last_name' => $gift['vendor_last_name'],
                    'profile_img' => $gift['vendor_profile_img']
                ];
            } else {
                $gift['vendor'] = null;
            }

            echo json_encode([
                'status' => 'success',
                'data' => $gift
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch gift: ' . $e->getMessage()
            ]);
        }
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