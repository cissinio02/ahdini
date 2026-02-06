-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 04 fév. 2026 à 05:12
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ahdini`
--

-- --------------------------------------------------------

--
-- Structure de la table `cards`
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
-- Structure de la table `extras`
--

CREATE TABLE `extras` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `extras`
--

INSERT INTO `extras` (`id`, `vendor_id`, `name`, `price`, `image`) VALUES
(1, NULL, 'flower', 500.00, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `gift`
--

CREATE TABLE `gift` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('Ramadan','Eid','Wedding','Birthday','Electronics','Books','Clothes','Shoes','Other') NOT NULL DEFAULT 'Other',
  `image` varchar(255) DEFAULT 'default_gift.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `gift`
--

INSERT INTO `gift` (`id`, `vendor_id`, `title`, `description`, `price`, `category`, `image`, `created_at`) VALUES
(3, NULL, 'Zikola land', 'xfcgvb', 1000.00, '', 'default_gift.png', '2025-12-18 03:25:19');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
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
-- Structure de la table `order_extra`
--

CREATE TABLE `order_extra` (
  `order_id` int(11) NOT NULL,
  `extra_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `order_gift`
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
-- Structure de la table `password_resets`
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
-- Structure de la table `users`
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
-- Déchargement des données de la table `users`
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
(21, 'flen', 'benflen', 'flen@gmail.com', '$2y$10$U6k.EFeo0dPNUWzXy.GJ7e73HkCeTvCAlUz7pgjN1jawfkxCEmar6', '', 'client', 'default_user.png', '2026-01-03 17:10:55');

-- --------------------------------------------------------

--
-- Structure de la table `vendor`
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

-- --------------------------------------------------------

--
-- Structure de la table `wrappings`
--

CREATE TABLE `wrappings` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `wrappings`
--

INSERT INTO `wrappings` (`id`, `name`, `price`, `image`) VALUES
(1, 'rouge', 200.00, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `extras`
--
ALTER TABLE `extras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_vendor` (`vendor_id`);

--
-- Index pour la table `gift`
--
ALTER TABLE `gift`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_vendor` (`vendor_id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `card_id` (`card_id`);

--
-- Index pour la table `order_extra`
--
ALTER TABLE `order_extra`
  ADD PRIMARY KEY (`order_id`,`extra_id`),
  ADD KEY `id_extra` (`extra_id`);

--
-- Index pour la table `order_gift`
--
ALTER TABLE `order_gift`
  ADD PRIMARY KEY (`order_id`,`gift_id`,`wrap_id`),
  ADD KEY `id_gift` (`gift_id`),
  ADD KEY `id_wrap` (`wrap_id`);

--
-- Index pour la table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `token` (`token`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`user_id`);

--
-- Index pour la table `wrappings`
--
ALTER TABLE `wrappings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `extras`
--
ALTER TABLE `extras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `gift`
--
ALTER TABLE `gift`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `wrappings`
--
ALTER TABLE `wrappings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `extras`
--
ALTER TABLE `extras`
  ADD CONSTRAINT `extras_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendor` (`id`);

--
-- Contraintes pour la table `gift`
--
ALTER TABLE `gift`
  ADD CONSTRAINT `gift_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendor` (`id`);

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`);

--
-- Contraintes pour la table `order_extra`
--
ALTER TABLE `order_extra`
  ADD CONSTRAINT `order_extra_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_extra_ibfk_2` FOREIGN KEY (`extra_id`) REFERENCES `extras` (`id`);

--
-- Contraintes pour la table `order_gift`
--
ALTER TABLE `order_gift`
  ADD CONSTRAINT `order_gift_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_gift_ibfk_2` FOREIGN KEY (`gift_id`) REFERENCES `gift` (`id`),
  ADD CONSTRAINT `order_gift_ibfk_3` FOREIGN KEY (`wrap_id`) REFERENCES `wrappings` (`id`);

--
-- Contraintes pour la table `vendor`
--
ALTER TABLE `vendor`
  ADD CONSTRAINT `vendor_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
