-- ================================================================
-- ORDERS SYSTEM MIGRATION - Feb 15, 2026
-- Simplified order tracking for Ahdini marketplace
-- ================================================================

-- Modify existing orders table to add vendor_id and gift_id
ALTER TABLE `orders` 
ADD COLUMN `vendor_id` INT(11) DEFAULT NULL AFTER `user_id`,
ADD COLUMN `gift_id` INT(11) DEFAULT NULL AFTER `vendor_id`,
ADD COLUMN `quantity` INT(11) DEFAULT 1 AFTER `gift_id`,
ADD COLUMN `price_at_sale` DECIMAL(10,2) DEFAULT NULL AFTER `quantity`,
ADD COLUMN `commission_amount` DECIMAL(10,2) DEFAULT NULL AFTER `price_at_sale`,
ADD COLUMN `payment_status` ENUM('pending', 'paid', 'refunded') DEFAULT 'pending' AFTER `commission_amount`,
ADD KEY `vendor_id` (`vendor_id`),
ADD KEY `gift_id` (`gift_id`);

-- Create vendor notifications table
CREATE TABLE `vendor_notifications` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `vendor_id` INT(11) NOT NULL,
  `order_id` INT(11) NOT NULL,
  `notification_type` ENUM('prepare_order', 'order_completed', 'order_cancelled') DEFAULT 'prepare_order',
  `preparation_date` DATE DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `vendor_id` (`vendor_id`),
  KEY `order_id` (`order_id`),
  FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`user_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Modify gift table if it doesn't have stock_quantity
ALTER TABLE `gift` 
ADD COLUMN `stock_quantity` INT(11) DEFAULT 999 AFTER `created_at`;

-- Create table for tracking Ahdini pickups
CREATE TABLE `ahdini_pickups` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `vendor_id` INT(11) NOT NULL,
  `order_id` INT(11) NOT NULL,
  `pickup_status` ENUM('pending', 'picked_up', 'in_delivery', 'delivered') DEFAULT 'pending',
  `pickup_date` DATE DEFAULT NULL,
  `delivery_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `vendor_id` (`vendor_id`),
  KEY `order_id` (`order_id`),
  FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`user_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
