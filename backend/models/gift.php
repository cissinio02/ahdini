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
 //create new gift
 public function create($data){
    Auth::checkAdmin();
    $stmt = $this->db->prepare(
        "INSERT INTO gift (title, description, price, category, image) VALUES (?,?,?,?,?)"
    
    );
    return $stmt->execute([
        $data['title'],
        $data['description'],
        $data['price'],
        $data['category'],
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
          "UPDATE gift SET title=?, description=?, price=?, category=?, image=? WHERE id=?"
      );
      return $stmt->execute([
          $data['title'],
          $data['description'],
          $data['price'],
          $data['category'],
          $data['image'],
          $id
      ]);
   }

   //get gift by id
   public function Read($id){
      $stmt = $this->db->prepare("SELECT * FROM gift WHERE id = ?");
      $stmt->execute([$id]);
      return $stmt->fetch(PDO::FETCH_ASSOC);
   }
}