<?php

class Gift {
 private $db;
  
 public function __construct($db){
 $this->db=$db;//initialize database connection
 }

    //get all gifts
 public function getAll(){
      $query="SELECT * FROM gift";
      $stmt=$this->db->prepare($query);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
 }

 public function getByCategory($category){
    $query="SELECT * FROM gift WHERE category=?";
    $stmt=$this->db->prepare($query);
    $stmt->execute([$category]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
 }

 public function getByOccasion($occasion){
    $query="SELECT * FROM gift WHERE occasion=?";
    $stmt=$this->db->prepare($query);
    $stmt->execute([$occasion]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
 }

 //create new gift
 public function create($data){
    Auth::checkAdmin();
    $stmt = $this->db->prepare(
        "INSERT INTO gift (title, description, price, category, occasion, image) VALUES (?,?,?,?,?,?)"
    
    );
    return $stmt->execute([
        $data['title'],
        $data['description'],
        $data['price'],
        $data['category'],
        $data['occasion'],
        $data['image']
    ]);
 }

   //delete gift by id
   public function delete($id){
      Auth::checkAdmin();
      $stmt = $this->db->prepare("DELETE FROM gift WHERE id = ?");
      return $stmt->execute([$id]);
   }

   //update gift by id
   public function update($id, $data){
      Auth::checkAdmin();
      $stmt = $this->db->prepare(
          "UPDATE gift SET title=?, description=?, price=?, category=?, occasion=?, image=? WHERE id=?"
      );
      return $stmt->execute([
          $data['title'],
          $data['description'],
          $data['price'],
          $data['category'],
          $data['occasion'],
          $data['image'],
          $id
      ]);
   }

   //get gift by id with vendor info
   public function Read($id){
      $query = "SELECT 
                  g.*,
                  v.shop_name as vendor_name,
                  v.shop_logo as vendor_logo,
                  u.first_name as vendor_first_name,
                  u.last_name as vendor_last_name,
                  u.profile_img as vendor_profile_img
                FROM gift g
                LEFT JOIN vendor v ON g.vendor_id = v.id
                LEFT JOIN users u ON v.user_id = u.id
                WHERE g.id = ?";
      
      $stmt = $this->db->prepare($query);
      $stmt->execute([$id]);
      return $stmt->fetch(PDO::FETCH_ASSOC);
   }

   // Get gift media (images and videos)
   public function getMedia($gift_id) {
       $query = "SELECT * FROM gift_media 
                 WHERE gift_id = ? 
                 ORDER BY display_order ASC";
       
       $stmt = $this->db->prepare($query);
       $stmt->execute([$gift_id]);
       
       return $stmt->fetchAll(PDO::FETCH_ASSOC);
   }

   // Get gift reviews with user info
   public function getReviews($gift_id) {
       $query = "SELECT 
                   r.*,
                   u.first_name,
                   u.last_name,
                   u.profile_img
                 FROM reviews r
                 JOIN users u ON r.user_id = u.id
                 WHERE r.gift_id = ?
                 ORDER BY r.created_at DESC";
       
       $stmt = $this->db->prepare($query);
       $stmt->execute([$gift_id]);
       
       return $stmt->fetchAll(PDO::FETCH_ASSOC);
   }

   // Get average rating and review count
   public function getRatingStats($gift_id) {
       $query = "SELECT 
                   COUNT(*) as review_count,
                   AVG(rating) as average_rating
                 FROM reviews
                 WHERE gift_id = ?";
       
       $stmt = $this->db->prepare($query);
       $stmt->execute([$gift_id]);
       
       return $stmt->fetch(PDO::FETCH_ASSOC);
   }
}