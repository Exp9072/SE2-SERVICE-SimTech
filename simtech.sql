-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2024 at 07:22 AM
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
  `pci_version` decimal(3,1) DEFAULT NULL,
  `min_watt` int(11) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `item_type`, `brand`, `model`, `price`, `stock_quantity`, `image_url`, `socket_type`, `ram_type`, `pci_version`, `min_watt`, `details`) VALUES
(1, 'Intel Core i9-11900K', 'Processor', 'Intel', 'i9-11900K', 6999860, 5, 'images/intel_i9_11900k.jpg', 'LGA1200', 'DDR4', NULL, NULL, NULL),
(2, 'AMD Ryzen 7 5800X', 'Processor', 'AMD', '5800X', 6299860, 11, 'images/amd_ryzen_7_5800x.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(3, 'NVIDIA GeForce RTX 3080', 'Graphics-Card', 'NVIDIA', 'RTX 3080', 9799860, 4, 'images/nvidia_rtx_3080.jpg', NULL, NULL, 4.0, NULL, NULL),
(4, 'AMD Radeon RX 6800 XT', 'Graphics-Card', 'AMD', 'RX 6800 XT', 9099860, 7, 'images/amd_rx_6800_xt.jpg', NULL, NULL, 4.0, NULL, NULL),
(5, 'Corsair Vengeance LPX 16GB', 'RAM', 'Corsair', 'Vengeance LPX', 1259860, 20, 'images/corsair_vengeance_lpx_16gb.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(6, 'G.Skill Trident Z RGB 32GB', 'RAM', 'G.Skill', 'Trident Z RGB', 2519860, 24, 'images/gskill_trident_z_rgb_32gb.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(7, 'ASUS ROG Strix B550-F', 'Motherboard', 'ASUS', 'ROG Strix B550-F', 2799860, 8, 'images/asus_rog_strix_b550_f.jpg', 'AM4', 'DDR4', 4.0, NULL, NULL),
(8, 'MSI MPG B550 Gaming Edge WiFi', 'Motherboard', 'MSI', 'MPG B550', 2800000, 9, 'images/msi_mpg_b550_gaming_edge_wifi.jpg', 'AM4', 'DDR4', 4.0, NULL, NULL),
(9, 'Paket Sultan', 'PC-Ready', 'LAPEER', 'PaketSultan', 90000000, 2, 'images/pcready1.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 9 7950X3D\r\nNVIDIA RTX 4090 SUPER\r\n64 GB DDR5 6400MHz\r\n2TB NVMe SSD Gen4\r\n1000W Modular PSU 80+ Platinum\r\nCasing Full Tower Premium\r\nWindows 11 Pro'),
(10, 'Paket Gaming', 'PC-Ready', 'LAPEER', 'PaketGaming', 45699860, 7, 'images/pcready2.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 7 7800x3d\r\nNVIDIA RTX 4080 SUPER\r\n32 GB DDR5 6000MHz\r\n1TB NVMe SSD Gen4\r\n750W Modular PSU 80+ Gold\r\nCasing Minimalis Premium\r\nWindows 11'),
(11, 'Paket Starter', 'PC-Ready', 'LAPEER', 'PaketStarter', 14985000, 8, 'images/pcready3.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 7 7800x3d\r\nNVIDIA RTX 4080 SUPER\r\n32 GB DDR5 6000MHz\r\n1TB NVMe SSD Gen4\r\n750W Modular PSU 80+ Gold\r\nCasing Minimalis Premium\r\nWindows 11'),
(12, 'ASUS Prime Z490-A', 'Motherboard', 'ASUS', 'Prime Z490-A', 3299860, 5, 'images/asus_prime_z490_a.jpg', 'LGA1200', 'DDR4', 4.0, NULL, NULL),
(13, 'Gigabyte Z790 Aorus Elite AX', 'Motherboard', 'Gigabyte', 'Z790 Aorus Elite AX', 5604000, 12, 'images/gigabyte_z790_aorus_elite_ax.jpg', 'LGA1700', 'DDR5', 5.0, NULL, NULL),
(14, 'Intel Core i7-12700K', 'Processor', 'Intel', 'i7-12700K', 5499000, 12, 'images/intel_i7_12700k.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(15, 'AMD Ryzen 9 5900X', 'Processor', 'AMD', '5900X', 8299000, 10, 'images/amd_ryzen_9_5900x.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(16, 'NVIDIA GeForce RTX 3060', 'Graphics-Card', 'NVIDIA', 'RTX 3060', 5599000, 8, 'images/nvidia_rtx_3060.jpg', NULL, NULL, 4.0, NULL, NULL),
(17, 'AMD Radeon RX 6600 XT', 'Graphics-Card', 'AMD', 'RX 6600 XT', 4799000, 6, 'images/amd_rx_6600_xt.jpg', NULL, NULL, 4.0, NULL, NULL),
(18, 'Kingston Fury Beast 16GB', 'RAM', 'Kingston', 'Fury Beast', 1159000, 31, 'images/kingston_fury_beast_16gb.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(19, 'Team T-Force Delta RGB 32GB', 'RAM', 'Team Group', 'T-Force Delta RGB', 2599000, 20, 'images/team_tforce_delta_rgb_32gb.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(20, 'ASUS TUF Gaming B550-PLUS', 'Motherboard', 'ASUS', 'TUF Gaming B550-PLUS', 3099000, 10, 'images/asus_tuf_gaming_b550_plus.jpg', 'AM4', 'DDR4', 4.0, NULL, NULL),
(21, 'MSI Z790 Tomahawk', 'Motherboard', 'MSI', 'Z790 Tomahawk', 5299000, 8, 'images/msi_z790_tomahawk.jpg', 'LGA1700', 'DDR5', 5.0, NULL, NULL),
(22, 'Samsung 870 EVO 1TB', 'Storage', 'Samsung', '870 EVO', 1599000, 26, 'images/samsung_870_evo_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(23, 'Western Digital Blue SN570 1TB', 'Storage', 'Western Digital', 'Blue SN570', 1399000, 20, 'images/wd_blue_sn570_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(24, 'NZXT H510', 'Casing', 'NZXT', 'H510', 1199000, 15, 'images/nzxt_h510.jpg', NULL, NULL, NULL, NULL, NULL),
(25, 'Corsair 4000D Airflow', 'Casing', 'Corsair', '4000D Airflow', 1399000, 20, 'images/corsair_4000d_airflow.jpg', NULL, NULL, NULL, NULL, NULL),
(26, 'Lian Li Lancool II Mesh', 'Casing', 'Lian Li', 'Lancool II Mesh', 1499000, 10, 'images/lian_li_lancool_ii_mesh.jpg', NULL, NULL, NULL, NULL, NULL),
(27, 'Corsair RM750x', 'PSU', 'Corsair', 'RM750x', 2099000, 15, 'images/corsair_rm750x.jpg', NULL, NULL, NULL, NULL, NULL),
(28, 'Cooler Master MWE Gold 750', 'PSU', 'Cooler Master', 'MWE Gold 750', 1899000, 20, 'images/cooler_master_mwe_gold_750.jpg', NULL, NULL, NULL, NULL, NULL),
(29, 'Paket Pro Gaming', 'PC-Ready', 'LAPEER', 'PaketProGaming', 18999900, 7, 'images/paket_pro_gaming.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 7 7800x3d\r\nNVIDIA RTX 4080 SUPER\r\n32 GB DDR5 6000MHz\r\n1TB NVMe SSD Gen4\r\n750W Modular PSU 80+ Gold\r\nCasing Minimalis Premium\r\nWindows 11'),
(30, 'Paket Editing Pro', 'PC-Ready', 'LAPEER', 'PaketEditingPro', 20999900, 6, 'images/paket_editing_pro.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 7 7800x3d\r\nNVIDIA RTX 4080 SUPER\r\n32 GB DDR5 6000MHz\r\n1TB NVMe SSD Gen4\r\n750W Modular PSU 80+ Gold\r\nCasing Minimalis Premium\r\nWindows 11'),
(31, 'Paket Streaming', 'PC-Ready', 'LAPEER', 'PaketStreaming', 17999900, 7, 'images/paket_streaming.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 7 7800x3d\r\nNVIDIA RTX 4080 SUPER\r\n32 GB DDR5 6000MHz\r\n1TB NVMe SSD Gen4\r\n750W Modular PSU 80+ Gold\r\nCasing Minimalis Premium\r\nWindows 11'),
(32, 'Paket Budget Starter', 'PC-Ready', 'LAPEER', 'PaketBudgetStarter', 9999900, 12, 'images/paket_budget_starter.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 7 7800x3d\r\nNVIDIA RTX 4080 SUPER\r\n32 GB DDR5 6000MHz\r\n1TB NVMe SSD Gen4\r\n750W Modular PSU 80+ Gold\r\nCasing Minimalis Premium\r\nWindows 11'),
(33, 'NZXT Kraken X63', 'Cooler', 'NZXT', 'Kraken X63', 2999000, 10, 'images/nzxt_kraken_x63.jpg', NULL, NULL, NULL, NULL, NULL),
(34, 'Corsair iCUE H100i Elite Capellix', 'Cooler', 'Corsair', 'iCUE H100i Elite Capellix', 3299000, 8, 'images/corsair_icue_h100i.jpg', NULL, NULL, NULL, NULL, NULL),
(35, 'Cooler Master Hyper 212 RGB', 'Cooling', 'Cooler Master', 'Hyper 212 RGB', 599000, 10, 'images/cooler_master_hyper_212_rgb.jpg', NULL, NULL, NULL, NULL, NULL),
(36, 'Noctua NH-D15', 'Cooling', 'Noctua', 'NH-D15', 1599000, 8, 'images/noctua_nh_d15.jpg', NULL, NULL, NULL, NULL, NULL),
(37, 'NZXT Kraken X63', 'Cooling', 'NZXT', 'Kraken X63', 2799000, 6, 'images/nzxt_kraken_x63.jpg', NULL, NULL, NULL, NULL, NULL),
(38, 'Corsair iCUE H100i Elite Capellix', 'Cooling', 'Corsair', 'iCUE H100i Elite Capellix', 2599000, 7, 'images/corsair_icue_h100i_elite_capellix.jpg', NULL, NULL, NULL, NULL, NULL),
(39, 'Deepcool AK620', 'Cooling', 'Deepcool', 'AK620', 899000, 12, 'images/deepcool_ak620.jpg', NULL, NULL, NULL, NULL, NULL),
(40, 'ARCTIC Freezer 34 eSports DUO', 'Cooling', 'ARCTIC', 'Freezer 34 eSports DUO', 649000, 15, 'images/arctic_freezer_34_esports_duo.jpg', NULL, NULL, NULL, NULL, NULL),
(41, 'Corsair RM850x', 'PSU', 'Corsair', 'RM850x', 1599000, 15, 'images/corsair_rm850x.jpg', NULL, NULL, NULL, NULL, NULL),
(42, 'EVGA SuperNOVA 750 G5', 'PSU', 'EVGA', 'SuperNOVA 750 G5', 1299000, 12, 'images/evga_supernova_750_g5.jpg', NULL, NULL, NULL, NULL, NULL),
(43, 'Seasonic Focus GX-850', 'PSU', 'Seasonic', 'Focus GX-850', 1499000, 10, 'images/seasonic_focus_gx_850.jpg', NULL, NULL, NULL, NULL, NULL),
(44, 'Cooler Master MWE Gold 650 V2', 'PSU', 'Cooler Master', 'MWE Gold 650 V2', 899000, 20, 'images/cooler_master_mwe_gold_650_v2.jpg', NULL, NULL, NULL, NULL, NULL),
(45, 'ASUS ROG Thor 850P', 'PSU', 'ASUS', 'ROG Thor 850P', 2899000, 8, 'images/asus_rog_thor_850p.jpg', NULL, NULL, NULL, NULL, NULL),
(46, 'NZXT C850', 'PSU', 'NZXT', 'C850', 1599000, 12, 'images/nzxt_c850.jpg', NULL, NULL, NULL, NULL, NULL),
(47, 'NZXT H510 Elite', 'Casing', 'NZXT', 'H510 Elite', 2399000, 10, 'images/nzxt_h510_elite.jpg', NULL, NULL, NULL, NULL, NULL),
(48, 'Corsair iCUE 4000X RGB', 'Casing', 'Corsair', 'iCUE 4000X RGB', 1999000, 15, 'images/corsair_icue_4000x_rgb.jpg', NULL, NULL, NULL, NULL, NULL),
(49, 'Cooler Master MasterBox TD500', 'Casing', 'Cooler Master', 'MasterBox TD500', 1399000, 20, 'images/cooler_master_masterbox_td500.jpg', NULL, NULL, NULL, NULL, NULL),
(50, 'Lian Li Lancool II Mesh', 'Casing', 'Lian Li', 'Lancool II Mesh', 1799000, 12, 'images/lian_li_lancool_ii_mesh.jpg', NULL, NULL, NULL, NULL, NULL),
(51, 'Phanteks Eclipse P400A', 'Casing', 'Phanteks', 'Eclipse P400A', 1599000, 19, 'images/phanteks_eclipse_p400a.jpg', NULL, NULL, NULL, NULL, NULL),
(52, 'Thermaltake Core P3', 'Casing', 'Thermaltake', 'Core P3', 2299000, 8, 'images/thermaltake_core_p3.jpg', NULL, NULL, NULL, NULL, NULL),
(53, 'Samsung 980 PRO 1TB', 'Storage', 'Samsung', '980 PRO', 1999000, 25, 'images/samsung_980_pro_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(54, 'Western Digital Black SN850 1TB', 'Storage', 'Western Digital', 'Black SN850', 1899000, 20, 'images/wd_black_sn850_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(55, 'Crucial MX500 1TB', 'Storage', 'Crucial', 'MX500', 1299000, 30, 'images/crucial_mx500_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(56, 'Kingston NV2 1TB', 'Storage', 'Kingston', 'NV2', 899000, 35, 'images/kingston_nv2_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(57, 'Seagate Barracuda 2TB', 'Storage', 'Seagate', 'Barracuda', 1099000, 40, 'images/seagate_barracuda_2tb.jpg', NULL, NULL, NULL, NULL, NULL),
(58, 'Toshiba X300 4TB', 'Storage', 'Toshiba', 'X300', 1999000, 15, 'images/toshiba_x300_4tb.jpg', NULL, NULL, NULL, NULL, NULL),
(59, 'Intel Core i7 12700K', 'Processor', 'Intel', 'i7 12700K', 4200000, 10, 'images/i7_12700k.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(60, 'Asus PRIME Z790-P WIFI-CSM', 'Motherboard', 'Asus', 'PRIME Z790-P WIFI-CSM', 3500000, 15, 'images/z790_p_wifi.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(61, 'Kingston Fury Beast DDR5 6000MHz 32GB', 'RAM', 'Kingston', 'Fury Beast DDR5 6000MHz', 2500000, 20, 'images/fury_ddr5.jpg', NULL, 'DDR5', NULL, NULL, NULL),
(62, 'MSI GeForce RTX 4080 SUPER 16GB', 'Graphics-Card', 'MSI', 'RTX 4080 SUPER', 16000000, 5, 'images/rtx4080_super.jpg', NULL, NULL, 5.0, 850, NULL),
(63, 'Super Flower Leadex Platinum SE 1000W', 'PSU', 'Super Flower', 'Leadex Platinum SE 1000W', 3000000, 8, 'images/leadex_1000w.jpg', NULL, NULL, NULL, 1000, NULL),
(64, 'AMD Ryzen 9 5900X', 'Processor', 'AMD', 'Ryzen 9 5900X', 5500000, 8, 'images/ryzen9_5900x.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(65, 'MSI MPG X570 Gaming Edge WiFi', 'Motherboard', 'MSI', 'MPG X570 Gaming Edge WiFi', 2500000, 12, 'images/x570_edge_wifi.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(66, 'Corsair Vengeance LPX DDR4 3200MHz 32GB', 'RAM', 'Corsair', 'Vengeance LPX DDR4 3200MHz', 1800000, 15, 'images/vengeance_ddr4.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(67, 'AMD Radeon RX 6900 XT 16GB', 'Graphics-Card', 'AMD', 'RX 6900 XT', 12000000, 7, 'images/rx6900xt.jpg', NULL, NULL, 4.0, 750, NULL),
(68, 'Corsair RM850x 850W', 'PSU', 'Corsair', 'RM850x', 1900000, 10, 'images/rm850x.jpg', NULL, NULL, NULL, 850, NULL),
(69, 'Intel Core i9 13900K', 'Processor', 'Intel', 'i9 13900K', 7500000, 6, 'images/i9_13900k.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(70, 'Gigabyte Z790 AORUS Elite AX', 'Motherboard', 'Gigabyte', 'Z790 AORUS Elite AX', 4500000, 10, 'images/aorus_z790.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(71, 'G.Skill Trident Z5 RGB DDR5 6000MHz 32GB', 'RAM', 'G.Skill', 'Trident Z5 RGB DDR5 6000MHz', 3000000, 10, 'images/tridentz_ddr5.jpg', NULL, 'DDR5', NULL, NULL, NULL),
(72, 'NVIDIA GeForce RTX 4090 24GB', 'Graphics-Card', 'NVIDIA', 'RTX 4090 Founders Edition', 24000000, 3, 'images/rtx4090.jpg', NULL, NULL, 5.0, 1000, NULL),
(73, 'Seasonic PRIME TX-1000', 'PSU', 'Seasonic', 'PRIME TX-1000', 3800000, 5, 'images/seasonic_tx1000.jpg', NULL, NULL, NULL, 1000, NULL),
(74, 'AMD Ryzen 7 5800X3D', 'Processor', 'AMD', 'Ryzen 7 5800X3D', 4500000, 8, 'images/ryzen7_5800x3d.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(75, 'ASUS TUF Gaming B550M-Plus WiFi', 'Motherboard', 'ASUS', 'TUF Gaming B550M-Plus WiFi', 1800000, 12, 'images/b550m_plus_wifi.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(76, 'Team T-Force Vulcan Z DDR4 3600MHz 16GB', 'RAM', 'Team', 'T-Force Vulcan Z DDR4 3600MHz', 1300000, 10, 'images/vulcanz_ddr4.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(77, 'NVIDIA GeForce RTX 3060 Ti 8GB', 'Graphics-Card', 'NVIDIA', 'RTX 3060 Ti', 8000000, 10, 'images/rtx3060ti.jpg', NULL, NULL, 4.0, 600, NULL),
(78, 'EVGA SuperNOVA 750 G6', 'PSU', 'EVGA', 'SuperNOVA 750 G6', 1500000, 12, 'images/evga_750g6.jpg', NULL, NULL, NULL, 750, NULL),
(79, 'Intel Core i5 13600KF', 'Processor', 'Intel', 'i5 13600KF', 3500000, 10, 'images/i5_13600kf.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(80, 'MSI PRO Z690-A DDR4', 'Motherboard', 'MSI', 'PRO Z690-A DDR4', 2400000, 10, 'images/z690a_ddr4.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(81, 'Kingston Fury Renegade DDR4 3600MHz 16GB', 'RAM', 'Kingston', 'Fury Renegade DDR4 3600MHz', 1200000, 15, 'images/fury_renegade_ddr4.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(82, 'MSI Radeon RX 6700 XT 12GB', 'Graphics-Card', 'MSI', 'RX 6700 XT', 6000000, 7, 'images/rx6700xt.jpg', NULL, NULL, 4.0, 650, NULL),
(83, 'Cooler Master V750 Gold V2', 'PSU', 'Cooler Master', 'V750 Gold V2', 1300000, 8, 'images/v750gold.jpg', NULL, NULL, NULL, 750, NULL),
(84, 'AMD Ryzen 5 5600G', 'Processor', 'AMD', 'Ryzen 5 5600G', 2000000, 12, 'images/ryzen5_5600g.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(85, 'ASUS ROG STRIX B550-F Gaming WiFi', 'Motherboard', 'ASUS', 'ROG STRIX B550-F Gaming WiFi', 1800000, 10, 'images/b550f_gaming_wifi.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(86, 'Corsair Vengeance RGB Pro DDR4 3200MHz 16GB', 'RAM', 'Corsair', 'Vengeance RGB Pro DDR4 3200MHz', 1200000, 15, 'images/vengeance_rgb_pro.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(87, 'NVIDIA GeForce GTX 1660 Super 6GB', 'Graphics-Card', 'NVIDIA', 'GTX 1660 Super', 2500000, 10, 'images/gtx1660super.jpg', NULL, NULL, 3.0, 450, NULL),
(88, 'Be Quiet! Straight Power 11 650W', 'PSU', 'Be Quiet!', 'Straight Power 11 650W', 1200000, 12, 'images/straight_power_11.jpg', NULL, NULL, NULL, 650, NULL),
(89, 'Intel Core i3 12100F', 'Processor', 'Intel', 'i3 12100F', 1500000, 20, 'images/i3_12100f.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(90, 'Gigabyte B660M DS3H AX DDR4', 'Motherboard', 'Gigabyte', 'B660M DS3H AX DDR4', 1600000, 12, 'images/b660m_ds3h_ax.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(91, 'Crucial Ballistix DDR4 2666MHz 16GB', 'RAM', 'Crucial', 'Ballistix DDR4 2666MHz', 800000, 20, 'images/ballistix_ddr4.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(92, 'NVIDIA GeForce RTX 3050 8GB', 'Graphics-Card', 'NVIDIA', 'RTX 3050', 3000000, 15, 'images/rtx3050.jpg', NULL, NULL, 4.0, 550, NULL),
(93, 'Thermaltake Toughpower GF1 650W', 'PSU', 'Thermaltake', 'Toughpower GF1 650W', 1000000, 10, 'images/toughpower_gf1_650w.jpg', NULL, NULL, NULL, 650, NULL),
(94, 'AMD Ryzen 9 7950X', 'Processor', 'AMD', 'Ryzen 9 7950X', 8500000, 6, 'images/ryzen9_7950x.jpg', 'AM5', 'DDR5', NULL, NULL, NULL),
(95, 'ASUS ROG Crosshair X670E Hero', 'Motherboard', 'ASUS', 'ROG Crosshair X670E Hero', 5500000, 5, 'images/x670e_hero.jpg', 'AM5', 'DDR5', NULL, NULL, NULL),
(96, 'Corsair Dominator Platinum DDR5 6000MHz 64GB', 'RAM', 'Corsair', 'Dominator Platinum DDR5 6000MHz', 6000000, 8, 'images/dominator_platinum_ddr5.jpg', NULL, 'DDR5', NULL, NULL, NULL),
(97, 'AMD Radeon RX 7900 XTX 24GB', 'Graphics-Card', 'AMD', 'RX 7900 XTX', 17000000, 4, 'images/rx7900xtx.jpg', NULL, NULL, 5.0, 1000, NULL),
(98, 'Thermaltake Toughpower GF3 1200W', 'PSU', 'Thermaltake', 'Toughpower GF3 1200W', 2500000, 7, 'images/toughpower_gf3_1200w.jpg', NULL, NULL, NULL, 1200, NULL),
(99, 'Intel Core i7 13700F', 'Processor', 'Intel', 'i7 13700F', 4300000, 10, 'images/i7_13700f.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(100, 'MSI MAG B760 Tomahawk WiFi DDR4', 'Motherboard', 'MSI', 'MAG B760 Tomahawk WiFi DDR4', 2800000, 12, 'images/b760_tomahawk.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(101, 'Corsair Vengeance LPX DDR4 3000MHz 32GB', 'RAM', 'Corsair', 'Vengeance LPX DDR4 3000MHz', 1600000, 15, 'images/vengeance_ddr4_3000.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(102, 'NVIDIA GeForce RTX 4060 Ti 8GB', 'Graphics-Card', 'NVIDIA', 'RTX 4060 Ti', 5000000, 11, 'images/rtx4060ti.jpg', NULL, NULL, 4.0, 650, NULL),
(103, 'FSP Hydro G Pro 850W', 'PSU', 'FSP', 'Hydro G Pro 850W', 1700000, 8, 'images/hydro_gpro_850w.jpg', NULL, NULL, NULL, 850, NULL),
(104, 'AMD Ryzen 7 7700X', 'Processor', 'AMD', 'Ryzen 7 7700X', 4500000, 10, 'images/ryzen7_7700x.jpg', 'AM5', 'DDR5', NULL, NULL, NULL),
(105, 'Gigabyte B650 AORUS Elite AX DDR5', 'Motherboard', 'Gigabyte', 'B650 AORUS Elite AX DDR5', 2500000, 12, 'images/b650_aorus_elite.jpg', 'AM5', 'DDR5', NULL, NULL, NULL),
(106, 'G.Skill Flare X5 DDR5 5200MHz 32GB', 'RAM', 'G.Skill', 'Flare X5 DDR5 5200MHz', 2200000, 15, 'images/flarex5_ddr5.jpg', NULL, 'DDR5', NULL, NULL, NULL),
(107, 'AMD Radeon RX 6800 XT 16GB', 'Graphics-Card', 'AMD', 'RX 6800 XT', 8500000, 6, 'images/rx6800xt.jpg', NULL, NULL, 4.0, 750, NULL),
(108, 'NZXT C850 850W', 'PSU', 'NZXT', 'C850', 1600000, 8, 'images/nzxt_c850.jpg', NULL, NULL, NULL, 850, NULL);

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
(3, 'jodyislami103@gmail.com', '2024-12-04 17:06:41', 74784720.00, 'paid', 'sedang dikirim'),
(4, 'jodyislami103@gmail.com', '2024-12-05 13:32:34', 46899020.00, 'paid', 'sedang dikirim'),
(5, 'jodyislami103@gmail.com', '2024-12-05 13:57:04', 55599300.00, 'paid', 'sedang dikirim'),
(6, 'jodyislami103@gmail.com', '2024-12-05 20:39:02', 18619580.00, 'paid', ''),
(7, 'jodyislami103@gmail.com', '2024-12-05 20:56:23', 45699860.00, 'paid', ''),
(8, 'jodyislami103@gmail.com', '2024-12-06 13:06:21', 28994860.00, 'unpaid', ''),
(9, 'jodyislami103@gmail.com', '2024-12-06 13:07:11', 29765720.00, 'unpaid', ''),
(10, 'jodyislami103@gmail.com', '2024-12-06 13:13:24', 27395000.00, 'unpaid', '');

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
(24, 3, 9, 1, 14099860.00),
(25, 4, 1, 1, 6999860.00),
(26, 4, 2, 1, 6299860.00),
(27, 4, 1, 1, 6999860.00),
(28, 4, 2, 1, 6299860.00),
(29, 4, 1, 1, 6999860.00),
(30, 4, 1, 1, 6999860.00),
(31, 4, 2, 1, 6299860.00),
(32, 5, 9, 1, 14099860.00),
(33, 5, 9, 1, 14099860.00),
(34, 5, 1, 1, 6999860.00),
(35, 5, 2, 1, 6299860.00),
(36, 5, 9, 1, 14099860.00),
(37, 6, 3, 1, 9799860.00),
(38, 6, 6, 1, 2519860.00),
(39, 6, 2, 1, 6299860.00),
(40, 7, 10, 1, 45699860.00),
(41, 8, 14, 1, 5499000.00),
(42, 8, 21, 1, 5299000.00),
(43, 8, 61, 1, 2500000.00),
(44, 8, 4, 1, 9099860.00),
(45, 8, 103, 1, 1700000.00),
(46, 8, 35, 1, 599000.00),
(47, 8, 53, 1, 1999000.00),
(48, 8, 52, 1, 2299000.00),
(49, 9, 15, 1, 8299000.00),
(50, 9, 8, 1, 2800000.00),
(51, 9, 6, 1, 2519860.00),
(52, 9, 3, 1, 9799860.00),
(53, 9, 98, 1, 2500000.00),
(54, 9, 40, 1, 649000.00),
(55, 9, 56, 1, 899000.00),
(56, 9, 52, 1, 2299000.00),
(57, 10, 14, 1, 5499000.00),
(58, 10, 21, 1, 5299000.00),
(59, 10, 96, 1, 6000000.00),
(60, 10, 102, 1, 5000000.00),
(61, 10, 108, 1, 1600000.00),
(62, 10, 39, 1, 899000.00),
(63, 10, 55, 1, 1299000.00),
(64, 10, 50, 1, 1799000.00);

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
(2, 1, 'jodyislami103@gmail.com', 'ewallet', '2024-12-05 11:09:05', 99999999.99),
(3, 4, 'jodyislami103@gmail.com', 'ewallet', '2024-12-05 13:34:00', 46899020.00),
(4, 5, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-05 13:57:11', 55599300.00),
(5, 7, 'jodyislami103@gmail.com', 'credit-card', '2024-12-05 21:00:28', 45699860.00),
(6, 6, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-05 21:00:37', 18619580.00);

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
(9, 'Jodyyy', 'jodi@cls-v2.com', 'jody123', 'user', NULL, NULL, NULL),
(10, 'aa', 'aaaa@aaaa.com', 'aa', 'user', NULL, NULL, NULL);

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
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
