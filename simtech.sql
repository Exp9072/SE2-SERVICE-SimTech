-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2024 at 06:55 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `simtech`
--

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `item_type` varchar(50) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(100) NOT NULL,
  `price` bigint(20) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `socket_type` varchar(50) DEFAULT NULL,
  `ram_type` varchar(50) DEFAULT NULL,
  `pci_version` decimal(3,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `item_type`, `brand`, `model`, `price`, `stock_quantity`, `image_url`, `socket_type`, `ram_type`, `pci_version`) VALUES
(1, 'Intel Core i9-11900K', 'Processor', 'Intel', 'i9-11900K', 6999860, 10, 'image/intel_i9_11900k.jpg', 'LGA1200', NULL, NULL),
(2, 'AMD Ryzen 7 5800X', 'Processor', 'AMD', '5800X', 6299860, 15, 'image/amd_ryzen_7_5800x.jpg', 'AM4', NULL, NULL),
(3, 'NVIDIA GeForce RTX 3080', 'Graphics-Card', 'NVIDIA', 'RTX 3080', 9799860, 5, 'image/nvidia_rtx_3080.jpg', NULL, NULL, 4.0),
(4, 'AMD Radeon RX 6800 XT', 'Graphics-Card', 'AMD', 'RX 6800 XT', 9099860, 7, 'image/amd_rx_6800_xt.jpg', NULL, NULL, 4.0),
(5, 'Corsair Vengeance LPX 16GB', 'RAM', 'Corsair', 'Vengeance LPX', 1259860, 20, 'image/corsair_vengeance_lpx_16gb.jpg', NULL, 'DDR4', NULL),
(6, 'G.Skill Trident Z RGB 32GB', 'RAM', 'G.Skill', 'Trident Z RGB', 2519860, 25, 'image/gskill_trident_z_rgb_32gb.jpg', NULL, 'DDR4', NULL),
(7, 'ASUS ROG Strix B550-F', 'Motherboard', 'ASUS', 'ROG Strix B550-F', 2799860, 8, 'image/asus_rog_strix_b550_f.jpg', 'AM4', 'DDR4', 4.0),
(8, 'MSI MPG B550 Gaming Edge WiFi', 'Motherboard', 'MSI', 'MPG B550', 2800000, 8, 'image/msi_mpg_b550_gaming_edge_wifi.jpg', 'AM4', 'DDR4', 4.0),
(9, 'Paket Sultan', 'PC-Ready', 'LAPEER', 'PaketSultan', 14099860, 5, 'image/pcready1.jpg', NULL, NULL, NULL),
(10, 'Paket Gaming', 'PC-Ready', 'LAPEER', 'PaketGaming', 45699860, 8, 'image/pcready2.jpg', NULL, NULL, NULL),
(11, 'Paket Starter', 'PC-Ready', 'LAPEER', 'PaketStarter', 14985000, 8, 'image/pcready3.jpg', NULL, NULL, NULL),
(12, 'ASUS Prime Z490-A', 'Motherboard', 'ASUS', 'Prime Z490-A', 3299860, 5, 'image/asus_prime_z490_a.jpg', 'LGA1200', 'DDR4', 4.0),
(13, 'Gigabyte Z790 Aorus Elite AX', 'Motherboard', 'Gigabyte', 'Z790 Aorus Elite AX', 5604000, 12, 'image/gigabyte_z790_aorus_elite_ax.jpg', 'LGA1700', 'DDR5', 5.0),
(14, 'Intel Core i7-12700K', 'Processor', 'Intel', 'i7-12700K', 5499000, 12, 'image/intel_i7_12700k.jpg', 'LGA1700', NULL, NULL),
(15, 'AMD Ryzen 9 5900X', 'Processor', 'AMD', '5900X', 8299000, 10, 'image/amd_ryzen_9_5900x.jpg', 'AM4', NULL, NULL),
(16, 'NVIDIA GeForce RTX 3060', 'Graphics-Card', 'NVIDIA', 'RTX 3060', 5599000, 8, 'image/nvidia_rtx_3060.jpg', NULL, NULL, 4.0),
(17, 'AMD Radeon RX 6600 XT', 'Graphics-Card', 'AMD', 'RX 6600 XT', 4799000, 6, 'image/amd_rx_6600_xt.jpg', NULL, NULL, 4.0),
(18, 'Kingston Fury Beast 16GB', 'RAM', 'Kingston', 'Fury Beast', 1159000, 30, 'image/kingston_fury_beast_16gb.jpg', NULL, 'DDR4', NULL),
(19, 'Team T-Force Delta RGB 32GB', 'RAM', 'Team Group', 'T-Force Delta RGB', 2599000, 20, 'image/team_tforce_delta_rgb_32gb.jpg', NULL, 'DDR4', NULL),
(20, 'ASUS TUF Gaming B550-PLUS', 'Motherboard', 'ASUS', 'TUF Gaming B550-PLUS', 3099000, 10, 'image/asus_tuf_gaming_b550_plus.jpg', 'AM4', 'DDR4', 4.0),
(21, 'MSI Z790 Tomahawk', 'Motherboard', 'MSI', 'Z790 Tomahawk', 5299000, 8, 'image/msi_z790_tomahawk.jpg', 'LGA1700', 'DDR5', 5.0),
(22, 'Samsung 870 EVO 1TB', 'Storage', 'Samsung', '870 EVO', 1599000, 25, 'image/samsung_870_evo_1tb.jpg', NULL, NULL, NULL),
(23, 'Western Digital Blue SN570 1TB', 'Storage', 'Western Digital', 'Blue SN570', 1399000, 20, 'image/wd_blue_sn570_1tb.jpg', NULL, NULL, NULL),
(24, 'NZXT H510', 'Casing', 'NZXT', 'H510', 1199000, 15, 'image/nzxt_h510.jpg', NULL, NULL, NULL),
(25, 'Corsair 4000D Airflow', 'Casing', 'Corsair', '4000D Airflow', 1399000, 20, 'image/corsair_4000d_airflow.jpg', NULL, NULL, NULL),
(26, 'Lian Li Lancool II Mesh', 'Casing', 'Lian Li', 'Lancool II Mesh', 1499000, 10, 'image/lian_li_lancool_ii_mesh.jpg', NULL, NULL, NULL),
(27, 'Corsair RM750x', 'PSU', 'Corsair', 'RM750x', 2099000, 15, 'image/corsair_rm750x.jpg', NULL, NULL, NULL),
(28, 'Cooler Master MWE Gold 750', 'PSU', 'Cooler Master', 'MWE Gold 750', 1899000, 20, 'image/cooler_master_mwe_gold_750.jpg', NULL, NULL, NULL),
(29, 'Paket Pro Gaming', 'PC-Ready', 'LAPEER', 'PaketProGaming', 18999900, 7, 'image/paket_pro_gaming.jpg', NULL, NULL, NULL),
(30, 'Paket Editing Pro', 'PC-Ready', 'LAPEER', 'PaketEditingPro', 20999900, 6, 'image/paket_editing_pro.jpg', NULL, NULL, NULL),
(31, 'Paket Streaming', 'PC-Ready', 'LAPEER', 'PaketStreaming', 17999900, 7, 'image/paket_streaming.jpg', NULL, NULL, NULL),
(32, 'Paket Budget Starter', 'PC-Ready', 'LAPEER', 'PaketBudgetStarter', 9999900, 12, 'image/paket_budget_starter.jpg', NULL, NULL, NULL),
(33, 'NZXT Kraken X63', 'Cooler', 'NZXT', 'Kraken X63', 2999000, 10, 'image/nzxt_kraken_x63.jpg', NULL, NULL, NULL),
(34, 'Corsair iCUE H100i Elite Capellix', 'Cooler', 'Corsair', 'iCUE H100i Elite Capellix', 3299000, 8, 'image/corsair_icue_h100i.jpg', NULL, NULL, NULL),
(35, 'Cooler Master Hyper 212 RGB', 'Cooling', 'Cooler Master', 'Hyper 212 RGB', 599000, 10, 'image/cooler_master_hyper_212_rgb.jpg', NULL, NULL, NULL),
(36, 'Noctua NH-D15', 'Cooling', 'Noctua', 'NH-D15', 1599000, 8, 'image/noctua_nh_d15.jpg', NULL, NULL, NULL),
(37, 'NZXT Kraken X63', 'Cooling', 'NZXT', 'Kraken X63', 2799000, 5, 'image/nzxt_kraken_x63.jpg', NULL, NULL, NULL),
(38, 'Corsair iCUE H100i Elite Capellix', 'Cooling', 'Corsair', 'iCUE H100i Elite Capellix', 2599000, 7, 'image/corsair_icue_h100i_elite_capellix.jpg', NULL, NULL, NULL),
(39, 'Deepcool AK620', 'Cooling', 'Deepcool', 'AK620', 899000, 12, 'image/deepcool_ak620.jpg', NULL, NULL, NULL),
(40, 'ARCTIC Freezer 34 eSports DUO', 'Cooling', 'ARCTIC', 'Freezer 34 eSports DUO', 649000, 15, 'image/arctic_freezer_34_esports_duo.jpg', NULL, NULL, NULL),
(41, 'Corsair RM850x', 'PSU', 'Corsair', 'RM850x', 1599000, 15, 'image/corsair_rm850x.jpg', NULL, NULL, NULL),
(42, 'EVGA SuperNOVA 750 G5', 'PSU', 'EVGA', 'SuperNOVA 750 G5', 1299000, 12, 'image/evga_supernova_750_g5.jpg', NULL, NULL, NULL),
(43, 'Seasonic Focus GX-850', 'PSU', 'Seasonic', 'Focus GX-850', 1499000, 10, 'image/seasonic_focus_gx_850.jpg', NULL, NULL, NULL),
(44, 'Cooler Master MWE Gold 650 V2', 'PSU', 'Cooler Master', 'MWE Gold 650 V2', 899000, 20, 'image/cooler_master_mwe_gold_650_v2.jpg', NULL, NULL, NULL),
(45, 'ASUS ROG Thor 850P', 'PSU', 'ASUS', 'ROG Thor 850P', 2899000, 8, 'image/asus_rog_thor_850p.jpg', NULL, NULL, NULL),
(46, 'NZXT C850', 'PSU', 'NZXT', 'C850', 1599000, 12, 'image/nzxt_c850.jpg', NULL, NULL, NULL),
(47, 'NZXT H510 Elite', 'Casing', 'NZXT', 'H510 Elite', 2399000, 10, 'image/nzxt_h510_elite.jpg', NULL, NULL, NULL),
(48, 'Corsair iCUE 4000X RGB', 'Casing', 'Corsair', 'iCUE 4000X RGB', 1999000, 15, 'image/corsair_icue_4000x_rgb.jpg', NULL, NULL, NULL),
(49, 'Cooler Master MasterBox TD500', 'Casing', 'Cooler Master', 'MasterBox TD500', 1399000, 20, 'image/cooler_master_masterbox_td500.jpg', NULL, NULL, NULL),
(50, 'Lian Li Lancool II Mesh', 'Casing', 'Lian Li', 'Lancool II Mesh', 1799000, 12, 'image/lian_li_lancool_ii_mesh.jpg', NULL, NULL, NULL),
(51, 'Phanteks Eclipse P400A', 'Casing', 'Phanteks', 'Eclipse P400A', 1599000, 18, 'image/phanteks_eclipse_p400a.jpg', NULL, NULL, NULL),
(52, 'Thermaltake Core P3', 'Casing', 'Thermaltake', 'Core P3', 2299000, 8, 'image/thermaltake_core_p3.jpg', NULL, NULL, NULL),
(53, 'Samsung 980 PRO 1TB', 'Storage', 'Samsung', '980 PRO', 1999000, 25, 'image/samsung_980_pro_1tb.jpg', NULL, NULL, NULL),
(54, 'Western Digital Black SN850 1TB', 'Storage', 'Western Digital', 'Black SN850', 1899000, 20, 'image/wd_black_sn850_1tb.jpg', NULL, NULL, NULL),
(55, 'Crucial MX500 1TB', 'Storage', 'Crucial', 'MX500', 1299000, 30, 'image/crucial_mx500_1tb.jpg', NULL, NULL, NULL),
(56, 'Kingston NV2 1TB', 'Storage', 'Kingston', 'NV2', 899000, 35, 'image/kingston_nv2_1tb.jpg', NULL, NULL, NULL),
(57, 'Seagate Barracuda 2TB', 'Storage', 'Seagate', 'Barracuda', 1099000, 40, 'image/seagate_barracuda_2tb.jpg', NULL, NULL, NULL),
(58, 'Toshiba X300 4TB', 'Storage', 'Toshiba', 'X300', 1999000, 15, 'image/toshiba_x300_4tb.jpg', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `order_date` datetime NOT NULL,
  `total_price` decimal(15,2) DEFAULT NULL,
  `payment` enum('paid','unpaid') DEFAULT 'unpaid',
  `status` enum('belum dikirim','sedang dikirim','sudah dikirim') DEFAULT 'belum dikirim'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `email`, `order_date`, `total_price`, `payment`, `status`) VALUES
(1, 'jodyislami103@gmail.com', '2024-12-04 14:26:22', 114784520.00, 'paid', 'sedang dikirim'),
(2, 'jodyislami103@gmail.com', '2024-12-04 15:27:17', 45699860.00, 'paid', 'sedang dikirim'),
(3, 'jodyislami103@gmail.com', '2024-12-04 17:06:41', 74784720.00, 'paid', 'sedang dikirim');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(16, 1, 9, 1, 14099860.00),
(17, 1, 10, 1, 45699860.00),
(18, 1, 11, 1, 14985000.00),
(19, 1, 29, 1, 18999900.00),
(20, 1, 30, 1, 20999900.00),
(21, 2, 10, 1, 45699860.00),
(22, 3, 11, 1, 14985000.00),
(23, 3, 10, 1, 45699860.00),
(24, 3, 9, 1, 14099860.00);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `payment_date` datetime DEFAULT current_timestamp(),
  `amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `email`, `payment_method`, `payment_date`, `amount`) VALUES
(1, 3, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-05 11:00:17', 74784720.00),
(2, 1, 'jodyislami103@gmail.com', 'ewallet', '2024-12-05 11:09:05', 99999999.99);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user-admin','user') NOT NULL DEFAULT 'user',
  `oauth_provider` enum('google','github','local') DEFAULT NULL,
  `oauth_id` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `oauth_provider`, `oauth_id`, `profile_picture`) VALUES
(1, 'Admin1', 'admin1@simtech.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'admin', NULL, NULL, NULL),
(2, 'User Admin1', 'user-admin1@simtech.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'user-admin', NULL, NULL, NULL),
(3, 'User2', 'user2@simtech.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'user', NULL, NULL, NULL),
(7, 'Muhammad Jody Putra Islami', 'jodyislami103@gmail.com', NULL, 'user', 'google', '101863837434744365423', 'https://lh3.googleusercontent.com/a/ACg8ocJd4G_mszuLRmyQ6x4oo_CLBRLRa6KSP6b6prmGa01-TWZ1Zmt_=s96-c'),
(8, 'Jody', 'Exp9072', NULL, 'user', 'github', '59360084', 'https://avatars.githubusercontent.com/u/59360084?v=4'),
(9, 'Jodyyy', 'jodi@cls-v2.com', 'jody123', 'user', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
