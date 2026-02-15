-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2026 at 08:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ahdini`
--

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `default_font` varchar(255) DEFAULT NULL,
  `default_font_color` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `extras`
--

CREATE TABLE `extras` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `extras`
--

INSERT INTO `extras` (`id`, `vendor_id`, `name`, `price`, `image`) VALUES
(1, NULL, 'flower', 500.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `gift`
--

CREATE TABLE `gift` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `info` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('Electronics','Books','Clothes','Shoes','Accessories','Toys & Plushies','Sweets & Chocolate','Other') NOT NULL DEFAULT 'Other',
  `occasion` enum('Anyday Gift','Birthday','Anniversary','Graduation','Wedding','New Baby','Ramadan','Eid','Other') NOT NULL DEFAULT 'Other',
  `image` varchar(255) DEFAULT 'default_gift.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gift`
--

INSERT INTO `gift` (`id`, `vendor_id`, `title`, `description`, `info`, `price`, `category`, `occasion`, `image`, `created_at`) VALUES
(1, NULL, 'El Freddy', 'Freddy vrai wa3r', 'Freddy Fazbear is the titular antagonist of the Five Nights at Freddy\'s series and the mascot of Freddy Fazbear\'s Pizza. He is an animatronic bear who serves as the primary antagonist, attacking the player in the first game and appearing in some form in all succeeding games.', 10.00, 'Toys & Plushies', 'Anyday Gift', '/images/ElFreddy.png', '2026-02-06 14:43:57'),
(2, NULL, 'El Cake', 'Cake vrai kbira', '\"The cake is a lie\" is a catchphrase from the 2007 video game Portal. Initially left behind as graffiti by Doug Rattmann to warn that GLaDOS, the game\'s main villain, was deceiving the player, it was intended to be a minor reference and esoteric joke by the game\'s development team that implied the player would never receive their promised reward.', 20.00, 'Sweets & Chocolate', 'Birthday', '/images/ElCake.png', '2026-02-06 14:48:27'),
(3, NULL, 'El telephones', 'Telephone vrai original  :O', ' telephone, commonly shortened to phone, is a telecommunications device that enables two or more users to conduct a conversation when they are too far apart to be easily heard directly. A telephone converts sound, typically and most efficiently the human voice, into electronic signals that are transmitted via cables and other communication channels to another telephone which reproduces the sound to the receiving user. ', 100.00, 'Electronics', 'Anyday Gift', '/images/ElTelephone.jpg', '2026-02-06 14:36:52'),
(4, NULL, 'El Mocheh Pijamas', 'Mochehh Pijamas vrai 7amya', 'Pajamas (American English) or pyjamas (Commonwealth English),[a] sometimes colloquially shortened to PJs,[1] jammies,[2] jim-jams, or in South Asia, night suits, are several related types of clothing worn as nightwear or while lounging. Pajamas are soft garments derived from the Indian and Iranian bottom-wear, the pyjamas, which were adopted in the Western world as nightwear.', 60.00, 'Clothes', 'Anniversary', '/images/ElPijamas.png', '2026-02-06 14:46:17'),
(5, NULL, 'El Zaza', 'Zaza fl original', 'high-quality, exotic cannabis (marijuana or hashish).', 300.00, 'Other', 'Anyday Gift', '/images/ElZaza.png', '2026-02-06 14:50:53'),
(6, NULL, 'El dinero', 'Dinero ta3 leurope', 'The dinero (diner in Catalan) was the currency of many of the Christian states of the Iberian Peninsula from the 10th century.[1] It evolved from the Carolingian denar (in Latin denarius) and was adopted by all Iberian Peninsula Carolingian-originated States: the Kingdom of Pamplona/Navarre, the Kingdom of Aragon, and the Catalan Counties.', 1.00, 'Accessories', 'Graduation', '/images/ElDinero.png', '2026-02-06 14:54:20'),
(7, NULL, 'El fourchet', 'Fourchet vrai bnina', ' utensil with a handle and multiple prongs (tines) used for eating, serving, or, in the case of tools like pitchforks, for lifting materials.', 5.00, 'Accessories', 'Wedding', '/images/ElFourchet.png', '2026-02-06 14:55:39'),
(8, NULL, 'El Bchma9', 'Bchma9 vrai mouri7', 'Flip-flops are a type of light sandal-like shoe, typically worn as a form of casual footwear. They consist of a flat sole held loosely on the foot by a Y-shaped strap known as a toe thong that passes between the first and second toes and around both sides of the foot. This style of footwear has been worn by people of many cultures throughout the world, originating as early as the ancient Egyptians in 1500 BC. In the United States the modern flip-flop may have had its design taken from the traditional Japanese zōri after World War II, as soldiers brought them back from Japan.', 15.00, 'Shoes', 'Eid', '/images/ElBchma9.png', '2026-02-06 14:57:17'),
(10, NULL, 'EL ri7a', 'ri7a vrai chaba', 'El perfume (proveniente del latín per, \'por\' y fumare, \'a través del humo\') hacía referencia, en tiempos muy antiguos, a la sustancia aromática que desprendía un humo fragante al ser quemada. Los romanos no utilizaron la palabra perfume y según demuestra el filólogo Joan Corominas, esta aparece por primera vez en lengua catalana en la obra El Terç del Crestià (1388) de Francesc Eiximenis. También otras obras como Lo Somni (1399) de Bernat Metge y Spill (1456) de Jaume Roig mencionan la costumbre de perfumarse en la alta sociedad catalana. No será hasta 1528 que la palabra perfume aparecerá en la literatura francesa. En la actualidad, la palabra perfume se refiere al líquido aromático que usa una persona, para desprender un olor agradable.', 50.00, 'Accessories', 'Ramadan', '/images/ElRi7a.png', '2026-02-05 22:00:27');

-- --------------------------------------------------------

--
-- Table structure for table `gift_media`
--

CREATE TABLE `gift_media` (
  `id` int(11) NOT NULL,
  `gift_id` int(11) NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `media_path` varchar(255) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gift_media`
--

INSERT INTO `gift_media` (`id`, `gift_id`, `media_type`, `media_path`, `display_order`, `is_primary`, `created_at`) VALUES
(1, 1, 'image', '/images/ElFreddy.png', 0, 1, '2026-02-12 14:53:32'),
(2, 1, 'image', '/images/ElFreddy.png', 1, 0, '2026-02-12 14:53:32'),
(3, 1, 'image', '/images/ElFreddy.png', 2, 0, '2026-02-12 14:53:32'),
(4, 1, 'image', '/images/ElFreddy.png', 3, 0, '2026-02-12 14:53:32'),
(5, 2, 'image', '/images/ElCake.png', 0, 1, '2026-02-12 14:53:32'),
(6, 2, 'image', '/images/ElCake.png', 1, 0, '2026-02-12 14:53:32'),
(7, 2, 'image', '/images/ElCake.png', 2, 0, '2026-02-12 14:53:32'),
(8, 2, 'video', '/videos/ElCake_video.mp4', 3, 0, '2026-02-12 14:53:32'),
(9, 3, 'image', '/images/ElTelephone.jpg', 0, 1, '2026-02-12 14:53:32'),
(10, 3, 'image', '/images/ElTelephone.jpg', 1, 0, '2026-02-12 14:53:32'),
(11, 3, 'image', '/images/ElTelephone.jpg', 2, 0, '2026-02-12 14:53:32'),
(12, 3, 'image', '/images/ElTelephone.jpg', 3, 0, '2026-02-12 14:53:32'),
(13, 4, 'image', '/images/ElPijamas.png', 0, 1, '2026-02-12 14:53:32'),
(14, 4, 'image', '/images/ElPijamas.png', 1, 0, '2026-02-12 14:53:32'),
(15, 4, 'image', '/images/ElPijamas.png', 2, 0, '2026-02-12 14:53:32'),
(16, 4, 'image', '/images/ElPijamas.png', 3, 0, '2026-02-12 14:53:32'),
(17, 5, 'image', '/images/ElZaza.png', 0, 1, '2026-02-12 14:53:32'),
(18, 5, 'image', '/images/ElZaza.png', 1, 0, '2026-02-12 14:53:32'),
(19, 5, 'image', '/images/ElZaza.png', 2, 0, '2026-02-12 14:53:32'),
(20, 5, 'video', '/videos/ElZaza_video.mp4', 3, 0, '2026-02-12 14:53:32'),
(21, 6, 'image', '/images/ElDinero.png', 0, 1, '2026-02-12 14:53:32'),
(22, 6, 'image', '/images/ElDinero.png', 1, 0, '2026-02-12 14:53:32'),
(23, 6, 'image', '/images/ElDinero.png', 2, 0, '2026-02-12 14:53:32'),
(24, 6, 'image', '/images/ElDinero.png', 3, 0, '2026-02-12 14:53:32'),
(25, 7, 'image', '/images/ElFourchet.png', 0, 1, '2026-02-12 14:53:32'),
(26, 7, 'image', '/images/ElFourchet.png', 1, 0, '2026-02-12 14:53:32'),
(27, 7, 'image', '/images/ElFourchet.png', 2, 0, '2026-02-12 14:53:32'),
(28, 7, 'image', '/images/ElFourchet.png', 3, 0, '2026-02-12 14:53:32'),
(29, 8, 'image', '/images/ElBchma9.png', 0, 1, '2026-02-12 14:53:32'),
(30, 8, 'image', '/images/ElBchma9.png', 1, 0, '2026-02-12 14:53:32'),
(31, 8, 'image', '/images/ElBchma9.png', 2, 0, '2026-02-12 14:53:32'),
(32, 8, 'image', '/images/ElBchma9.png', 3, 0, '2026-02-12 14:53:32'),
(33, 10, 'image', '/images/ElRi7a.png', 0, 1, '2026-02-12 14:53:32'),
(34, 10, 'image', '/images/ElRi7a.png', 1, 0, '2026-02-12 14:53:32'),
(35, 10, 'image', '/images/ElRi7a.png', 2, 0, '2026-02-12 14:53:32'),
(36, 10, 'image', '/images/ElRi7a.png', 3, 0, '2026-02-12 14:53:32');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `message_text` varchar(100) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `status` enum('scheduled','preparing','ready_for_pickup','in_transit','delivered','cancelled') DEFAULT 'scheduled',
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pickup_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_extra`
--

CREATE TABLE `order_extra` (
  `order_id` int(11) NOT NULL,
  `extra_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_gift`
--

CREATE TABLE `order_gift` (
  `order_id` int(11) NOT NULL,
  `gift_id` int(11) NOT NULL,
  `wrap_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price_at_sale` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(128) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `gift_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(1) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `gift_id`, `user_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 5, 'Amazing Freddy plushie! My kid absolutely loves it. Great quality and fast delivery!', '2026-02-10 09:30:00', NULL),
(2, 1, 12, 4, 'Very cute and well-made. Slightly smaller than expected but still worth it.', '2026-02-09 13:20:00', NULL),
(3, 1, 15, 5, 'Perfect gift for my nephew! He sleeps with it every night now. Highly recommend!', '2026-02-08 15:45:00', NULL),
(4, 2, 13, 5, 'Delicious cake! Perfect for the birthday party. Everyone loved it!', '2026-02-11 08:15:00', NULL),
(5, 2, 14, 5, 'Best cake I have ever ordered online. Fresh and tasty!', '2026-02-10 17:30:00', NULL),
(6, 3, 17, 5, 'Excellent phone! Works perfectly and came in original packaging.', '2026-02-09 10:00:00', NULL),
(7, 3, 18, 4, 'Good phone for the price. Battery life is amazing.', '2026-02-08 12:25:00', NULL),
(8, 3, 19, 5, 'Very happy with this purchase. Fast shipping and great customer service!', '2026-02-07 14:40:00', NULL),
(9, 3, 20, 3, 'Phone is okay but took longer to arrive than expected.', '2026-02-06 11:10:00', NULL),
(10, 4, 21, 5, 'Super comfortable pijamas! The fabric is soft and the fit is perfect.', '2026-02-11 19:00:00', NULL),
(11, 4, 22, 4, 'Nice quality but runs a bit small. Order one size up!', '2026-02-10 21:15:00', NULL),
(12, 5, 2, 5, 'Absolutely love this! Exactly as described and arrived quickly.', '2026-02-09 07:30:00', NULL),
(13, 5, 3, 5, 'Great product! Would definitely buy again.', '2026-02-08 18:45:00', NULL),
(14, 6, 12, 4, 'Good accessory. Looks authentic and well-made.', '2026-02-10 13:00:00', NULL),
(15, 7, 13, 5, 'Beautiful set of forks! Perfect for the wedding gift. Thank you!', '2026-02-11 10:30:00', NULL),
(16, 7, 14, 4, 'Elegant and classy. Great quality for the price.', '2026-02-10 16:20:00', NULL),
(17, 8, 15, 5, 'Very comfortable shoes! Perfect for Eid celebration.', '2026-02-09 08:00:00', NULL),
(18, 8, 17, 4, 'Nice shoes but took a few days to break in. Overall satisfied!', '2026-02-08 11:30:00', NULL),
(19, 8, 18, 5, 'Excellent quality and stylish design. Will buy again!', '2026-02-07 15:15:00', NULL),
(20, 10, 19, 5, 'Amazing fragrance! Lasts all day and smells wonderful.', '2026-02-11 12:45:00', NULL),
(21, 10, 20, 5, 'Perfect for Ramadan gifts. Everyone complimented the scent!', '2026-02-10 09:20:00', NULL),
(22, 10, 21, 4, 'Good perfume but a bit pricey. Still worth it though!', '2026-02-09 14:30:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `role` enum('admin','client','vendor') DEFAULT 'client',
  `profile_img` varchar(255) DEFAULT 'default_user.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `phone`, `role`, `profile_img`, `created_at`) VALUES
(2, 'testuser', 'testuser', 'testuser2@example.com', '$2y$10$lteYIU/s8WuXUEM3N4B6E.kn9OdY/wIx9TEp2ypTO3LUSkiDEwAMm', '', 'client', 'default_user.png', '2025-12-19 21:28:18'),
(3, 'Yacine', '  Bouregaa', 'bouregaayacine31@gmail.com', '123', '', 'client', 'default_user.png', '2025-12-19 21:29:26'),
(4, 'alaa', 'mkeibes', 'alaaklb106@gmail.com', NULL, '', 'client', 'default_user.png', '2025-12-20 17:57:54'),
(5, 'ahmed', 'hamou', 'bouregaayacine90@gmail.com', '$2y$10$ZIXuLhI7O4A7iDCnPrjo2uN01JUPtbV2fU0OKhbD9N.KlarNY06o6', '', 'client', 'default_user.png', '2025-12-23 01:57:42'),
(6, 'ahmed', 'hamou', 'bouregaayacine500@gmail.com', '$2y$10$I0ymQcO7Rqg4dYnIp8EAGeVCrH2XTg8vC6MTiqPLd24zpfkANRcIy', '', 'client', 'default_user.png', '2025-12-23 02:00:52'),
(7, 'ahmed', 'hamou', 'bouregaayacine600@gmail.com', '$2y$10$cF.hsPGIKqblRtrFbjIuYOfH9k1vgOM6MiH38/PJDwu8FET0vOgii', '', 'client', 'default_user.png', '2025-12-23 02:08:58'),
(8, 'ahmed', 'hamou', 'bouregaayacine700@gmail.com', '$2y$10$H6g9fq6.iQx/S0PD5Tl9cOqrNLX7FQGTZUPBhreoIW5wE.qe/M7ly', '', 'client', 'default_user.png', '2025-12-23 02:13:44'),
(9, 'ahmed', 'hamou', 'bouregaayacine800@gmail.com', '$2y$10$VXqt1ov8n1WmiQnXXaoKDua/sSTWmPUMOZyRDa.3HIUUv1AY54i9O', '', 'client', 'default_user.png', '2025-12-23 02:15:32'),
(10, 'ahmed', 'hamou', 'bouregaayacine900@gmail.com', '$2y$10$jinGzmz5hq47Rs7FCqYiB.u8grOktKh.3r1KjRgYYZVtTxXs.FSj6', '', 'client', 'default_user.png', '2025-12-23 02:21:12'),
(11, 'ahmed', 'hamou', 'bouregaayacine00@gmail.com', '$2y$10$x6UEuIoFAWRAsS9Vo9doM.ZwWJNjZOXqfVECvxvRtQ6JGfCZER8QW', '', 'client', 'default_user.png', '2025-12-23 02:21:24'),
(12, 'Yacine', 'Bouregaa', 'bouregaayacine3@gmail.com', '$2y$10$gLyPF6NfHNFZ9mK7EvqFjuNiRCNvwWjuJt/g3v4.GUaRcPx8PdT4O', '', 'client', 'default_user.png', '2025-12-25 13:06:23'),
(13, 'Yacine', 'Bouregaa', 'bouregaayacine@gmail.com', '$2y$10$HjqxeOhiAuAgWd6aBLjZWefpn8.LlqjHMtcESvJ7RJp9tkWEW3Upu', '', 'client', 'default_user.png', '2025-12-25 15:11:18'),
(14, 'Yacine', 'Bouregaa', 'bouregaayacine100@gmail.com', '$2y$10$bad8sHGjIBWDYKqkLbhV.eEQDF4dJYt4jqmxdKVslHSVHuH8ZJeK2', '', 'client', 'default_user.png', '2025-12-25 15:41:47'),
(15, 'Aya', 'Bouregaa', 'bouregaaaya@icloud.com', '$2y$10$N6oJfEw/PmuPcXzfFeUyNuy1srJrv9GkxsfoeEc9VeHyuienLne9G', '', 'client', 'default_user.png', '2025-12-25 15:44:57'),
(16, 'abidich', 'gueroui', 'bouregaayacine5@gmail.com', '$2y$10$DZBJxUPBofxO5oJLAfPKNubfDpb9QKmFZegsfzohwfrYt9hyT1Y8.', '', 'client', 'default_user.png', '2025-12-25 16:22:52'),
(17, 'Yasser', 'Bouregaa', 'bouregaayasser@gmail.com', '$2y$10$wD1jP10nN7tFehn7.gZVcuLMH2fG.pmp0QD0olGekM2UEPPSB0p7K', '', 'client', 'default_user.png', '2025-12-26 13:08:24'),
(18, 'Driss', 'Bouregaa', 'bouregaadriss@gmail.com', '$2y$10$BDuskiTXvH4di215Zd0srecHzlvfPCbLIhdcqck5lWyf01YxSw3Pi', '', 'client', 'default_user.png', '2025-12-29 16:29:51'),
(19, 'mou', 'aaa', 'aaaa@gmail.com', '$2y$10$nSaukCUHPUYWoH8QFFct1uN/DbGzC8w4zqJyzrE76jVqh.9OoZ/dW', '', 'client', 'default_user.png', '2025-12-29 22:05:51'),
(20, 'hamou', 'babou', 'babou@gmail.com', '$2y$10$giBF3ZpHiH3o8/rtBsNRqe9.vC4o3dnSWQ3VABvp.EJ/lc6fXHbnm', '', 'client', 'default_user.png', '2025-12-29 23:23:57'),
(21, 'flen', 'benflen', 'flen@gmail.com', '$2y$10$U6k.EFeo0dPNUWzXy.GJ7e73HkCeTvCAlUz7pgjN1jawfkxCEmar6', '', 'client', 'default_user.png', '2026-01-03 17:10:55'),
(22, 'Bob', 'Roberto', 'bob@gmail.com', '$2y$10$C8X8nzMuarEmPfAWB8GcCO7rSVV1uGL4Xtne4pgHKdq6lgrjvBoF2', '', 'client', 'default_user.png', '2026-02-04 18:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `shop_name` varchar(255) NOT NULL,
  `shop_location` varchar(255) DEFAULT NULL,
  `shop_logo` varchar(255) DEFAULT NULL,
  `commission_rate` decimal(5,2) DEFAULT 10.00,
  `is_active` tinyint(1) DEFAULT 0,
  `shop_phone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendor`
--

INSERT INTO `vendor` (`id`, `user_id`, `shop_name`, `shop_location`, `shop_logo`, `commission_rate`, `is_active`, `shop_phone`) VALUES
(5, 22, 'bobshop', 'oran', 'bob.png', 10.00, 1, '077984564');

-- --------------------------------------------------------

--
-- Table structure for table `wrappings`
--

CREATE TABLE `wrappings` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wrappings`
--

INSERT INTO `wrappings` (`id`, `name`, `price`, `image`) VALUES
(1, 'rouge', 200.00, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `extras`
--
ALTER TABLE `extras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_vendor` (`vendor_id`);

--
-- Indexes for table `gift`
--
ALTER TABLE `gift`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_vendor` (`vendor_id`);

--
-- Indexes for table `gift_media`
--
ALTER TABLE `gift_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gift_id` (`gift_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `card_id` (`card_id`);

--
-- Indexes for table `order_extra`
--
ALTER TABLE `order_extra`
  ADD PRIMARY KEY (`order_id`,`extra_id`),
  ADD KEY `id_extra` (`extra_id`);

--
-- Indexes for table `order_gift`
--
ALTER TABLE `order_gift`
  ADD PRIMARY KEY (`order_id`,`gift_id`,`wrap_id`),
  ADD KEY `id_gift` (`gift_id`),
  ADD KEY `id_wrap` (`wrap_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `token` (`token`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gift_id` (`gift_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`user_id`);

--
-- Indexes for table `wrappings`
--
ALTER TABLE `wrappings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `extras`
--
ALTER TABLE `extras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `gift`
--
ALTER TABLE `gift`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT for table `gift_media`
--
ALTER TABLE `gift_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `wrappings`
--
ALTER TABLE `wrappings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `extras`
--
ALTER TABLE `extras`
  ADD CONSTRAINT `extras_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendor` (`id`);

--
-- Constraints for table `gift`
--
ALTER TABLE `gift`
  ADD CONSTRAINT `gift_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendor` (`id`);

--
-- Constraints for table `gift_media`
--
ALTER TABLE `gift_media`
  ADD CONSTRAINT `gift_media_ibfk_1` FOREIGN KEY (`gift_id`) REFERENCES `gift` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`);

--
-- Constraints for table `order_extra`
--
ALTER TABLE `order_extra`
  ADD CONSTRAINT `order_extra_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_extra_ibfk_2` FOREIGN KEY (`extra_id`) REFERENCES `extras` (`id`);

--
-- Constraints for table `order_gift`
--
ALTER TABLE `order_gift`
  ADD CONSTRAINT `order_gift_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_gift_ibfk_2` FOREIGN KEY (`gift_id`) REFERENCES `gift` (`id`),
  ADD CONSTRAINT `order_gift_ibfk_3` FOREIGN KEY (`wrap_id`) REFERENCES `wrappings` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`gift_id`) REFERENCES `gift` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vendor`
--
ALTER TABLE `vendor`
  ADD CONSTRAINT `vendor_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
