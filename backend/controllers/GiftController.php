<?php
require_once __DIR__ . '/../middleware/aut.php'; 
require_once __DIR__ . '/../models/gift.php';

class GiftController {
    private $giftModel;

    public function __construct($db) {
        $this->giftModel = new Gift($db);
    }

    /**
     * bring all gifts for public listing (no auth required)
     */
    public function listGifts() {
        $gifts = $this->giftModel->getAll();
        http_response_code(200);
        return [
            "status" => "success",
            "data" => $gifts
        ];
    }

    /**
     * bring gifts for the logged-in vendor (or admin) to manage their gifts
     */
    public function listVendorGifts() {
        checkVendor(); // check if user is vendor or admin
        
        // Get vendor ID from vendor table using user_id
        $userId = $_SESSION['user_id'];
        $vendorStmt = $this->giftModel->getDb()->prepare("SELECT id FROM vendor WHERE user_id = ?");
        $vendorStmt->execute([$userId]);
        $vendor = $vendorStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$vendor) {
            http_response_code(403);
            return [
                "status" => "error",
                "message" => "You don't have a vendor account setup."
            ];
        }
        
        $vendorId = $vendor['id'];
        $gifts = $this->giftModel->getByVendorId($vendorId); 
        
        http_response_code(200);
        return [
            "status" => "success",
            "data" => $gifts
        ];
    }

    /**
     * add new gift only for vendors or admins
     */
    public function addGift() {
        checkVendor(); 

        // Get vendor ID from vendor table using user_id
        $userId = $_SESSION['user_id'];
        $vendorStmt = $this->giftModel->getDb()->prepare("SELECT id FROM vendor WHERE user_id = ?");
        $vendorStmt->execute([$userId]);
        $vendor = $vendorStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$vendor) {
            http_response_code(403);
            return ["status" => "error", "message" => "You don't have a vendor account setup."];
        }
        
        $vendorId = $vendor['id'];

        // Handle multipart/form-data
        $data = $_POST;
        $file = $_FILES['image'] ?? null;

        if (empty($data['name']) && empty($data['title'])) {
            http_response_code(400);
            return ["status" => "error", "message" => "Name is required."];
        }

        if (empty($data['price'])) {
            http_response_code(400);
            return ["status" => "error", "message" => "Price is required."];
        }

        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            return ["status" => "error", "message" => "Image is required."];
        }

        // Validate file type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mime, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
            http_response_code(400);
            return ["status" => "error", "message" => "Invalid image format. Use PNG, JPG, GIF, or WebP."];
        }

        // Validate file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            http_response_code(400);
            return ["status" => "error", "message" => "Image must be smaller than 5MB."];
        }

        // Create uploads directory if it doesn't exist
        $uploadsDir = __DIR__ . '/../../uploads/gifts/';
        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0755, true);
        }

        // Generate unique filename
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('gift_') . '.' . $ext;
        $filepath = $uploadsDir . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            http_response_code(500);
            return ["status" => "error", "message" => "Failed to save image."];
        }

        // Store relative path for database
        $imagePath = '/uploads/gifts/' . $filename;

        // normalize keys
        $giftData = [
            'title' => $data['name'] ?? $data['title'] ?? '',
            'description' => $data['description'] ?? '',
            'price' => $data['price'] ?? 0,
            'category' => $data['category'] ?? 'luxury',
            'image' => $imagePath,
            'vendor_id' => $vendorId
        ];

        $result = $this->giftModel->create($giftData);
        
        if ($result) {
            http_response_code(201);
            return [
                "status" => "success",
                "message" => "Gift added successfully!",
                "image" => $imagePath
            ];
        } else {
            // Delete uploaded file if database insert fails
            @unlink($filepath);
            http_response_code(500);
            return ["status" => "error", "message" => "Database insertion failed"];
        }
    }

    /**
     * update gift 
     */
    public function updateGift($id) {
        checkVendor();

        $data = $_POST;
        $file = $_FILES['image'] ?? null;
        
        // normalize keys
        $updateData = [
            'title' => $data['name'] ?? $data['title'] ?? '',
            'description' => $data['description'] ?? '',
            'price' => $data['price'] ?? 0,
            'category' => $data['category'] ?? 'luxury'
        ];

        // Handle file upload if provided
        if ($file && $file['error'] === UPLOAD_ERR_OK) {
            // Validate file type
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);
            
            if (!in_array($mime, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
                http_response_code(400);
                return ["status" => "error", "message" => "Invalid image format. Use PNG, JPG, GIF, or WebP."];
            }

            // Validate file size (max 5MB)
            if ($file['size'] > 5 * 1024 * 1024) {
                http_response_code(400);
                return ["status" => "error", "message" => "Image must be smaller than 5MB."];
            }

            // Create uploads directory if it doesn't exist
            $uploadsDir = __DIR__ . '/../../uploads/gifts/';
            if (!is_dir($uploadsDir)) {
                mkdir($uploadsDir, 0755, true);
            }

            // Generate unique filename
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = uniqid('gift_') . '.' . $ext;
            $filepath = $uploadsDir . $filename;

            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                http_response_code(500);
                return ["status" => "error", "message" => "Failed to save image."];
            }

            // Store relative path for database
            $updateData['image'] = '/uploads/gifts/' . $filename;
        }

        $result = $this->giftModel->update($id, $updateData);
        
        if ($result) {
            http_response_code(200);
            return ["status" => "success", "message" => "Gift updated successfully"];
        } else {
            http_response_code(500);
            return ["status" => "error", "message" => "Update failed"];
        }
    }

    /**
     * delete gift (vendor can only delete their own gifts)
     */
    public function deleteGift($id) {
        checkVendor();

        // Get vendor ID from vendor table using user_id
        $userId = $_SESSION['user_id'];
        $vendorStmt = $this->giftModel->getDb()->prepare("SELECT id FROM vendor WHERE user_id = ?");
        $vendorStmt->execute([$userId]);
        $vendor = $vendorStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$vendor) {
            http_response_code(403);
            return ["status" => "error", "message" => "You don't have a vendor account setup."];
        }
        
        $vendorId = $vendor['id'];

        // Verify the gift belongs to this vendor
        $gift = $this->giftModel->Read($id);
        if (!$gift || $gift['vendor_id'] != $vendorId) {
            http_response_code(403);
            return ["status" => "error", "message" => "You don't have permission to delete this gift."];
        }

        $result = $this->giftModel->delete($id);
        
        if ($result) {
            http_response_code(200);
            return ["status" => "success", "message" => "Gift deleted successfully"];
        } else {
            http_response_code(500);
            return ["status" => "error", "message" => "Delete failed"];
        }
    }
}