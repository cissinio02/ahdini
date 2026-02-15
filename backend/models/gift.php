<?php

class Gift {
 private $db;
  
 public function __construct($db){
 $this->db=$db;//initialize database connection
 }

 /**
  * Get database connection
  */
 public function getDb() {
     return $this->db;
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
 
 //create new gift
 public function create($data){
    $stmt = $this->db->prepare(
        "INSERT INTO gift (title, description, price, category, image, vendor_id) VALUES (?,?,?,?,?,?)"
    );
    return $stmt->execute([
        $data['title'],
        $data['description'],
        $data['price'],
        $data['category'],
        $data['image'],
        $data['vendor_id']
    ]);
 }

   //delete gift by id
   public function delete($id){
      $stmt = $this->db->prepare("DELETE FROM gift WHERE id = ?");
      return $stmt->execute([$id]);
   }

   //update gift by id
   public function update($id, $data){
      $updates = [];
      $values = [];
      
      foreach ($data as $key => $value) {
          if (!empty($value) || $key === 'image') {
              $updates[] = "$key=?";
              $values[] = $value;
          }
      }
      
      if (empty($updates)) {
          return false;
      }
      
      $values[] = $id;
      $query = "UPDATE gift SET " . implode(', ', $updates) . " WHERE id = ?";
      $stmt = $this->db->prepare($query);
      return $stmt->execute($values);
   }

   //get gift by id
   public function Read($id){
      $stmt = $this->db->prepare("SELECT * FROM gift WHERE id = ?");
      $stmt->execute([$id]);
      return $stmt->fetch(PDO::FETCH_ASSOC);
   }

   public function getByVendorId($vendorId) {
    $stmt = $this->db->prepare("SELECT * FROM gift WHERE vendor_id = ? ORDER BY created_at DESC");
    $stmt->execute([$vendorId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

}