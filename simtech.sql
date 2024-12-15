-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2024 at 02:03 PM
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
(1, 'Intel Core i9-11900K', 'Processor', 'Intel', 'i9-11900K', 6999860, 8, 'images/intel_i9_11900k.jpg', 'LGA1200', 'DDR4', NULL, NULL, NULL),
(2, 'AMD Ryzen 7 5800X', 'Processor', 'AMD', '5800X', 6299860, 7, 'images/amd_ryzen_7_5800x.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(3, 'NVIDIA GeForce RTX 3080', 'Graphics-Card', 'NVIDIA', 'RTX 3080', 9799860, 15, 'images/nvidia_rtx_3080.jpg', NULL, NULL, 4.0, NULL, NULL),
(4, 'AMD Radeon RX 6800 XT', 'Graphics-Card', 'AMD', 'RX 6800 XT', 9099860, 6, 'images/amd_rx_6800_xt.jpg', NULL, NULL, 4.0, NULL, NULL),
(5, 'Corsair Vengeance LPX 16GB', 'RAM', 'Corsair', 'Vengeance LPX', 1259860, 18, 'images/corsair_vengeance_lpx_16gb.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(6, 'G.Skill Trident Z RGB 32GB', 'RAM', 'G.Skill', 'Trident Z RGB', 2519860, 25, 'images/gskill_trident_z_rgb_32gb.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(7, 'ASUS ROG Strix B550-F', 'Motherboard', 'ASUS', 'ROG Strix B550-F', 2799860, 7, 'images/asus_rog_strix_b550_f.jpg', 'AM4', 'DDR4', 4.0, NULL, NULL),
(8, 'MSI MPG B550 Gaming Edge WiFi', 'Motherboard', 'MSI', 'MPG B550', 2800000, 9, 'images/msi_mpg_b550_gaming_edge_wifi.jpg', 'AM4', 'DDR4', 4.0, NULL, NULL),
(9, 'Paket Sultan', 'PC-Ready', 'LAPEER', 'PaketSultan', 90000000, 7, 'images/pcready1.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 9 7950X3D\r\nNVIDIA RTX 4090 SUPER\r\n64 GB DDR5 6400MHz\r\n2TB NVMe SSD Gen4\r\n1000W Modular PSU 80+ Platinum\r\nCasing Full Tower Premium\r\nWindows 11 Pro'),
(10, 'Paket Gaming', 'PC-Ready', 'LAPEER', 'PaketGaming', 45699860, 7, 'images/pcready2.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\nAMD Ryzen 7 7800x3d\r\nNVIDIA RTX 4080 SUPER\r\n32 GB DDR5 6000MHz\r\n1TB NVMe SSD Gen4\r\n750W Modular PSU 80+ Gold\r\nCasing Minimalis Premium\r\nWindows 11'),
(11, 'Paket Starter', 'PC-Ready', 'LAPEER', 'PaketStarter', 14985000, 5, 'images/pcready3.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\n- AMD Ryzen 5 5600X\r\n- NVIDIA RTX 3060 \r\n- 16 GB DDR4 3200MHz\r\n- 512GB NVMe SSD Gen3\r\n- 600W PSU 80+ Bronze\r\n- Casing Mid Tower dengan Cooling yang Baik\r\n- Windows 11'),
(12, 'ASUS Prime Z490-A', 'Motherboard', 'ASUS', 'Prime Z490-A', 3299860, 15, 'images/asus_prime_z490_a.jpg', 'LGA1200', 'DDR4', 4.0, NULL, NULL),
(13, 'Gigabyte Z790 Aorus Elite AX', 'Motherboard', 'Gigabyte', 'Z790 Aorus Elite AX', 5604000, 10, 'images/gigabyte_z790_aorus_elite_ax.jpg', 'LGA1700', 'DDR5', 5.0, NULL, NULL),
(14, 'Intel Core i7-12700K', 'Processor', 'Intel', 'i7-12700K', 5499000, 12, 'images/intel_i7_12700k.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(15, 'AMD Ryzen 9 5900X', 'Processor', 'AMD', '5900X', 8299000, 9, 'images/amd_ryzen_9_5900x.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(16, 'NVIDIA GeForce RTX 3060', 'Graphics-Card', 'NVIDIA', 'RTX 3060', 5599000, 8, 'images/nvidia_rtx_3060.jpg', NULL, NULL, 4.0, NULL, NULL),
(17, 'AMD Radeon RX 6600 XT', 'Graphics-Card', 'AMD', 'RX 6600 XT', 4799000, 6, 'images/amd_rx_6600_xt.jpg', NULL, NULL, 4.0, NULL, NULL),
(18, 'Kingston Fury Beast 16GB', 'RAM', 'Kingston', 'Fury Beast', 1159000, 28, 'images/kingston_fury_beast_16gb.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(19, 'Team T-Force Delta RGB 32GB', 'RAM', 'Team Group', 'T-Force Delta RGB', 2599000, 20, 'images/team_tforce_delta_rgb_32gb.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(20, 'ASUS TUF Gaming B550-PLUS', 'Motherboard', 'ASUS', 'TUF Gaming B550-PLUS', 3099000, 10, 'images/asus_tuf_gaming_b550_plus.jpg', 'AM4', 'DDR4', 4.0, NULL, NULL),
(21, 'MSI Z790 Tomahawk', 'Motherboard', 'MSI', 'Z790 Tomahawk', 5299000, 9, 'images/msi_z790_tomahawk.jpg', 'LGA1700', 'DDR5', 5.0, NULL, NULL),
(22, 'Samsung 870 EVO 1TB', 'Storage', 'Samsung', '870 EVO', 1599000, 26, 'images/samsung_870_evo_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(23, 'Western Digital Blue SN570 1TB', 'Storage', 'Western Digital', 'Blue SN570', 1399000, 20, 'images/wd_blue_sn570_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(24, 'NZXT H510', 'Casing', 'NZXT', 'H510', 1199000, 15, 'images/nzxt_h510.jpg', NULL, NULL, NULL, NULL, NULL),
(25, 'Corsair 4000D Airflow', 'Casing', 'Corsair', '4000D Airflow', 1399000, 20, 'images/corsair_4000d_airflow.jpg', NULL, NULL, NULL, NULL, NULL),
(26, 'Lian Li Lancool II Mesh', 'Casing', 'Lian Li', 'Lancool II Mesh', 1499000, 11, 'images/lian_li_lancool_ii_mesh.jpg', NULL, NULL, NULL, NULL, NULL),
(27, 'Corsair RM750x', 'PSU', 'Corsair', 'RM750x', 2099000, 15, 'images/corsair_rm750x.jpg', NULL, NULL, NULL, NULL, NULL),
(28, 'Cooler Master MWE Gold 750', 'PSU', 'Cooler Master', 'MWE Gold 750', 1899000, 20, 'images/cooler_master_mwe_gold_750.jpg', NULL, NULL, NULL, NULL, NULL),
(29, 'Paket Pro Gaming', 'PC-Ready', 'LAPEER', 'PaketProGaming', 18999900, 4, 'images/paket_pro_gaming.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\n- AMD Ryzen 7 5700X\r\n- NVIDIA RTX 3060 \r\n- 16 GB DDR4 3600MHz\r\n- 1TB NVMe SSD Gen3\r\n- 650W PSU 80+ Bronze\r\n- Casing Full Tower dengan Sistem Pendingin yang Efisien\r\n- Windows 11'),
(30, 'Paket Editing Pro', 'PC-Ready', 'LAPEER', 'PaketEditingPro', 20999900, 2, 'images/paket_editing_pro.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\n- AMD Ryzen 7 5700X \r\n- NVIDIA RTX 3070 \r\n- 16 GB DDR4 3600MHz\r\n- 1TB NVMe SSD Gen3\r\n- 650W PSU 80+ Bronze\r\n- Casing Full Tower dengan Sistem Pendingin yang Efisien\r\n- Windows 11'),
(31, 'Paket Streaming', 'PC-Ready', 'LAPEER', 'PaketStreaming', 17999900, 4, 'images/paket_streaming.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\n- AMD Ryzen 5 5600X \r\n- NVIDIA RTX 3060 \r\n- 16 GB DDR4 3600MHz\r\n- 1TB NVMe SSD Gen3\r\n- 650W PSU 80+ Bronze\r\n- Casing Full Tower dengan Sistem Pendingin yang Efisien\r\n- Windows 11'),
(32, 'Paket Budget Starter', 'PC-Ready', 'LAPEER', 'PaketBudgetStarter', 9999900, 9, 'images/paket_budget_starter.jpg', NULL, NULL, NULL, NULL, 'Spesifikasi Lengkap: \r\n- AMD Ryzen 5 5600X\r\n- NVIDIA GTX 1660 Ti\r\n- 8 GB DDR4 3200MHz\r\n- 512GB SSD\r\n- 550W PSU 80+ Bronze\r\n- Casing Kompak dengan Desain Sederhana\r\n- Windows 11'),
(33, 'NZXT Kraken X63', 'Cooler', 'NZXT', 'Kraken X63', 2999000, 10, 'images/nzxt_kraken_x63.jpg', NULL, NULL, NULL, NULL, NULL),
(34, 'Corsair iCUE H100i Elite Capellix', 'Cooler', 'Corsair', 'iCUE H100i Elite Capellix', 3299000, 8, 'images/corsair_icue_h100i.jpg', NULL, NULL, NULL, NULL, NULL),
(35, 'Cooler Master Hyper 212 RGB', 'Cooling', 'Cooler Master', 'Hyper 212 RGB', 599000, 10, 'images/cooler_master_hyper_212_rgb.jpg', NULL, NULL, NULL, NULL, NULL),
(36, 'Noctua NH-D15', 'Cooling', 'Noctua', 'NH-D15', 1599000, 8, 'images/noctua_nh_d15.jpg', NULL, NULL, NULL, NULL, NULL),
(37, 'NZXT Kraken X63', 'Cooling', 'NZXT', 'Kraken X63', 2799000, 8, 'images/nzxt_kraken_x63.jpg', NULL, NULL, NULL, NULL, NULL),
(38, 'Corsair iCUE H100i Elite Capellix', 'Cooling', 'Corsair', 'iCUE H100i Elite Capellix', 2599000, 7, 'images/corsair_icue_h100i_elite_capellix.jpg', NULL, NULL, NULL, NULL, NULL),
(39, 'Deepcool AK620', 'Cooling', 'Deepcool', 'AK620', 899000, 12, 'images/deepcool_ak620.jpg', NULL, NULL, NULL, NULL, NULL),
(40, 'ARCTIC Freezer 34 eSports DUO', 'Cooling', 'ARCTIC', 'Freezer 34 eSports DUO', 649000, 16, 'images/arctic_freezer_34_esports_duo.jpg', NULL, NULL, NULL, NULL, NULL),
(41, 'Corsair RM850x', 'PSU', 'Corsair', 'RM850x', 1599000, 14, 'images/corsair_rm850x.jpg', NULL, NULL, NULL, NULL, NULL),
(42, 'EVGA SuperNOVA 750 G5', 'PSU', 'EVGA', 'SuperNOVA 750 G5', 1299000, 12, 'images/evga_supernova_750_g5.jpg', NULL, NULL, NULL, NULL, NULL),
(43, 'Seasonic Focus GX-850', 'PSU', 'Seasonic', 'Focus GX-850', 1499000, 10, 'images/seasonic_focus_gx_850.jpg', NULL, NULL, NULL, NULL, NULL),
(44, 'Cooler Master MWE Gold 650 V2', 'PSU', 'Cooler Master', 'MWE Gold 650 V2', 899000, 20, 'images/cooler_master_mwe_gold_650_v2.jpg', NULL, NULL, NULL, NULL, NULL),
(45, 'ASUS ROG Thor 850P', 'PSU', 'ASUS', 'ROG Thor 850P', 2899000, 8, 'images/asus_rog_thor_850p.jpg', NULL, NULL, NULL, NULL, NULL),
(46, 'NZXT C850', 'PSU', 'NZXT', 'C850', 1599000, 12, 'images/nzxt_c850.jpg', NULL, NULL, NULL, NULL, NULL),
(47, 'NZXT H510 Elite', 'Casing', 'NZXT', 'H510 Elite', 2399000, 10, 'images/nzxt_h510_elite.jpg', NULL, NULL, NULL, NULL, NULL),
(48, 'Corsair iCUE 4000X RGB', 'Casing', 'Corsair', 'iCUE 4000X RGB', 1999000, 15, 'images/corsair_icue_4000x_rgb.jpg', NULL, NULL, NULL, NULL, NULL),
(49, 'Cooler Master MasterBox TD500', 'Casing', 'Cooler Master', 'MasterBox TD500', 1399000, 20, 'images/cooler_master_masterbox_td500.jpg', NULL, NULL, NULL, NULL, NULL),
(50, 'Lian Li Lancool II Mesh', 'Casing', 'Lian Li', 'Lancool II Mesh', 1799000, 12, 'images/lian_li_lancool_ii_mesh.jpg', NULL, NULL, NULL, NULL, NULL),
(51, 'Phanteks Eclipse P400A', 'Casing', 'Phanteks', 'Eclipse P400A', 1599000, 20, 'images/phanteks_eclipse_p400a.jpg', NULL, NULL, NULL, NULL, NULL),
(52, 'Thermaltake Core P3', 'Casing', 'Thermaltake', 'Core P3', 2299000, 11, 'images/thermaltake_core_p3.jpg', NULL, NULL, NULL, NULL, NULL),
(53, 'Samsung 980 PRO 1TB', 'Storage', 'Samsung', '980 PRO', 1999000, 26, 'images/samsung_980_pro_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(54, 'Western Digital Black SN850 1TB', 'Storage', 'Western Digital', 'Black SN850', 1899000, 21, 'images/wd_black_sn850_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(55, 'Crucial MX500 1TB', 'Storage', 'Crucial', 'MX500', 1299000, 30, 'images/crucial_mx500_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(56, 'Kingston NV2 1TB', 'Storage', 'Kingston', 'NV2', 899000, 35, 'images/kingston_nv2_1tb.jpg', NULL, NULL, NULL, NULL, NULL),
(57, 'Seagate Barracuda 2TB', 'Storage', 'Seagate', 'Barracuda', 1099000, 40, 'images/seagate_barracuda_2tb.jpg', NULL, NULL, NULL, NULL, NULL),
(58, 'Toshiba X300 4TB', 'Storage', 'Toshiba', 'X300', 1999000, 15, 'images/toshiba_x300_4tb.jpg', NULL, NULL, NULL, NULL, NULL),
(59, 'Intel Core i7 12700K', 'Processor', 'Intel', 'i7 12700K', 4200000, 8, 'images/i7_12700k.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(60, 'Asus PRIME Z790-P WIFI-CSM', 'Motherboard', 'Asus', 'PRIME Z790-P WIFI-CSM', 3500000, 14, 'images/z790_p_wifi.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(61, 'Kingston Fury Beast DDR5 6000MHz 32GB', 'RAM', 'Kingston', 'Fury Beast DDR5 6000MHz', 2500000, 21, 'images/fury_ddr5.jpg', NULL, 'DDR5', NULL, NULL, NULL),
(62, 'MSI GeForce RTX 4080 SUPER 16GB', 'Graphics-Card', 'MSI', 'RTX 4080 SUPER', 16000000, 6, 'images/rtx4080_super.jpg', NULL, NULL, 5.0, 850, NULL),
(63, 'Super Flower Leadex Platinum SE 1000W', 'PSU', 'Super Flower', 'Leadex Platinum SE 1000W', 3000000, 8, 'images/leadex_1000w.jpg', NULL, NULL, NULL, 1000, NULL),
(64, 'AMD Ryzen 9 5900X', 'Processor', 'AMD', 'Ryzen 9 5900X', 5500000, 8, 'images/ryzen9_5900x.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(65, 'MSI MPG X570 Gaming Edge WiFi', 'Motherboard', 'MSI', 'MPG X570 Gaming Edge WiFi', 2500000, 12, 'images/x570_edge_wifi.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(66, 'Corsair Vengeance LPX DDR4 3200MHz 32GB', 'RAM', 'Corsair', 'Vengeance LPX DDR4 3200MHz', 1800000, 15, 'images/vengeance_ddr4.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(67, 'AMD Radeon RX 6900 XT 16GB', 'Graphics-Card', 'AMD', 'RX 6900 XT', 12000000, 7, 'images/rx6900xt.jpg', NULL, NULL, 4.0, 750, NULL),
(68, 'Corsair RM850x 850W', 'PSU', 'Corsair', 'RM850x', 1900000, 11, 'images/rm850x.jpg', NULL, NULL, NULL, 850, NULL),
(69, 'Intel Core i9 13900K', 'Processor', 'Intel', 'i9 13900K', 7500000, 6, 'images/i9_13900k.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(70, 'Gigabyte Z790 AORUS Elite AX', 'Motherboard', 'Gigabyte', 'Z790 AORUS Elite AX', 4500000, 10, 'images/aorus_z790.jpg', 'LGA1700', 'DDR5', NULL, NULL, NULL),
(71, 'G.Skill Trident Z5 RGB DDR5 6000MHz 32GB', 'RAM', 'G.Skill', 'Trident Z5 RGB DDR5 6000MHz', 3000000, 9, 'images/tridentz_ddr5.jpg', NULL, 'DDR5', NULL, NULL, NULL),
(72, 'NVIDIA GeForce RTX 4090 24GB', 'Graphics-Card', 'NVIDIA', 'RTX 4090 Founders Edition', 24000000, 16, 'images/rtx4090.jpg', NULL, NULL, 5.0, 1000, NULL),
(73, 'Seasonic PRIME TX-1000', 'PSU', 'Seasonic', 'PRIME TX-1000', 3800000, 4, 'images/seasonic_tx1000.jpg', NULL, NULL, NULL, 1000, NULL),
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
(84, 'AMD Ryzen 5 5600G', 'Processor', 'AMD', 'Ryzen 5 5600G', 2000000, 13, 'images/ryzen5_5600g.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(85, 'ASUS ROG STRIX B550-F Gaming WiFi', 'Motherboard', 'ASUS', 'ROG STRIX B550-F Gaming WiFi', 1800000, 11, 'images/b550f_gaming_wifi.jpg', 'AM4', 'DDR4', NULL, NULL, NULL),
(86, 'Corsair Vengeance RGB Pro DDR4 3200MHz 16GB', 'RAM', 'Corsair', 'Vengeance RGB Pro DDR4 3200MHz', 1200000, 15, 'images/vengeance_rgb_pro.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(87, 'NVIDIA GeForce GTX 1660 Super 6GB', 'Graphics-Card', 'NVIDIA', 'GTX 1660 Super', 2500000, 10, 'images/gtx1660super.jpg', NULL, NULL, 3.0, 450, NULL),
(88, 'Be Quiet! Straight Power 11 650W', 'PSU', 'Be Quiet!', 'Straight Power 11 650W', 1200000, 12, 'images/straight_power_11.jpg', NULL, NULL, NULL, 650, NULL),
(89, 'Intel Core i3 12100F', 'Processor', 'Intel', 'i3 12100F', 1500000, 20, 'images/i3_12100f.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(90, 'Gigabyte B660M DS3H AX DDR4', 'Motherboard', 'Gigabyte', 'B660M DS3H AX DDR4', 1600000, 12, 'images/b660m_ds3h_ax.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(91, 'Crucial Ballistix DDR4 2666MHz 16GB', 'RAM', 'Crucial', 'Ballistix DDR4 2666MHz', 800000, 20, 'images/ballistix_ddr4.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(92, 'NVIDIA GeForce RTX 3050 8GB', 'Graphics-Card', 'NVIDIA', 'RTX 3050', 3000000, 15, 'images/rtx3050.jpg', NULL, NULL, 4.0, 550, NULL),
(93, 'Thermaltake Toughpower GF1 650W', 'PSU', 'Thermaltake', 'Toughpower GF1 650W', 1000000, 10, 'images/toughpower_gf1_650w.jpg', NULL, NULL, NULL, 650, NULL),
(94, 'AMD Ryzen 9 7950X', 'Processor', 'AMD', 'Ryzen 9 7950X', 8500000, 7, 'images/ryzen9_7950x.jpg', 'AM5', 'DDR5', NULL, NULL, NULL),
(95, 'ASUS ROG Crosshair X670E Hero', 'Motherboard', 'ASUS', 'ROG Crosshair X670E Hero', 5500000, 5, 'images/x670e_hero.jpg', 'AM5', 'DDR5', NULL, NULL, NULL),
(96, 'Corsair Dominator Platinum DDR5 6000MHz 64GB', 'RAM', 'Corsair', 'Dominator Platinum DDR5 6000MHz', 6000000, 9, 'images/dominator_platinum_ddr5.jpg', NULL, 'DDR5', NULL, NULL, NULL),
(97, 'AMD Radeon RX 7900 XTX 24GB', 'Graphics-Card', 'AMD', 'RX 7900 XTX', 17000000, 13, 'images/rx7900xtx.jpg', NULL, NULL, 5.0, 1000, NULL),
(98, 'Thermaltake Toughpower GF3 1200W', 'PSU', 'Thermaltake', 'Toughpower GF3 1200W', 2500000, 8, 'images/toughpower_gf3_1200w.jpg', NULL, NULL, NULL, 1200, NULL),
(99, 'Intel Core i7 13700F', 'Processor', 'Intel', 'i7 13700F', 4300000, 10, 'images/i7_13700f.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(100, 'MSI MAG B760 Tomahawk WiFi DDR4', 'Motherboard', 'MSI', 'MAG B760 Tomahawk WiFi DDR4', 2800000, 12, 'images/b760_tomahawk.jpg', 'LGA1700', 'DDR4', NULL, NULL, NULL),
(101, 'Corsair Vengeance LPX DDR4 3000MHz 32GB', 'RAM', 'Corsair', 'Vengeance LPX DDR4 3000MHz', 1600000, 15, 'images/vengeance_ddr4_3000.jpg', NULL, 'DDR4', NULL, NULL, NULL),
(102, 'NVIDIA GeForce RTX 4060 Ti 8GB', 'Graphics-Card', 'NVIDIA', 'RTX 4060 Ti', 5000000, 12, 'images/rtx4060ti.jpg', NULL, NULL, 4.0, 650, NULL),
(103, 'FSP Hydro G Pro 850W', 'PSU', 'FSP', 'Hydro G Pro 850W', 1700000, 9, 'images/hydro_gpro_850w.jpg', NULL, NULL, NULL, 850, NULL),
(104, 'AMD Ryzen 7 7700X', 'Processor', 'AMD', 'Ryzen 7 7700X', 4500000, 10, 'images/ryzen7_7700x.jpg', 'AM5', 'DDR5', NULL, NULL, NULL),
(105, 'Gigabyte B650 AORUS Elite AX DDR5', 'Motherboard', 'Gigabyte', 'B650 AORUS Elite AX DDR5', 2500000, 13, 'images/b650_aorus_elite.jpg', 'AM5', 'DDR5', NULL, NULL, NULL),
(106, 'G.Skill Flare X5 DDR5 5200MHz 32GB', 'RAM', 'G.Skill', 'Flare X5 DDR5 5200MHz', 2200000, 15, 'images/flarex5_ddr5.jpg', NULL, 'DDR5', NULL, NULL, NULL),
(107, 'AMD Radeon RX 6800 XT 16GB', 'Graphics-Card', 'AMD', 'RX 6800 XT', 8500000, 6, 'images/rx6800xt.jpg', NULL, NULL, 4.0, 750, NULL),
(108, 'NZXT C850 850W', 'PSU', 'NZXT', 'C850', 1600000, 9, 'images/nzxt_c850.jpg', NULL, NULL, NULL, 850, NULL),
(109, 'NVDIA RTX 2080', 'Graphics-Card', 'NVIDIA', 'RTX 2080', 8100000, 29, 'images/rtx2080.jpg\r\n', NULL, NULL, NULL, NULL, ''),
(110, 'NVDIA RTX 2070', 'Graphics-Card', 'NVIDIA', 'RTX 2070', 7500000, 15, 'images/rtx2070.jpg', '', '', 0.0, 200, ''),
(111, 'NVDIA RTX 2070', 'Graphics-Card', 'NVIDIA', 'RTX 2070', 7500000, 15, 'images/rtx2070.jpg', '', '', 0.0, 200, ''),
(112, 'NVDIA RTX 2070', 'Graphics-Card', 'NVIDIA', 'RTX 2070', 7500000, 15, 'images/rtx2070.jpg', '', '', 0.0, 200, ''),
(113, 'NVDIA RTX 2070', 'Graphics-Card', 'NVIDIA', 'RTX 2070', 7500000, 15, 'images/rtx2070.jpg', '', '', 0.0, 200, ''),
(114, 'NVDIA RTX 2070', 'Graphics-Card', 'NVIDIA', 'RTX 2070', 7500000, 15, 'images/rtx2070.jpg', '', '', 0.0, 200, ''),
(115, 'NVDIA RTX 2070', 'Graphics-Card', 'NVIDIA', 'RTX 2070', 7500000, 15, 'images/rtx2070.jpg', '', '', 0.0, 200, '');

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
(6, 'jodyislami103@gmail.com', '2024-12-05 20:39:02', 18619580.00, 'paid', 'sudah dikirim'),
(7, 'jodyislami103@gmail.com', '2024-12-05 20:56:23', 45699860.00, 'paid', 'sudah dikirim'),
(13, 'Exp9072', '2024-12-10 14:05:48', 45699860.00, 'paid', 'sudah dikirim'),
(14, 'Exp9072', '2024-12-10 22:57:11', 18999900.00, 'paid', 'sedang dikirim'),
(15, 'Exp9072', '2024-12-11 12:29:35', 101798860.00, 'paid', 'sedang dikirim'),
(19, 'Exp9072', '2024-12-11 12:56:05', 34215860.00, 'paid', 'sedang dikirim'),
(20, 'Exp9072', '2024-12-11 22:39:31', 9099860.00, 'paid', 'sedang dikirim'),
(21, 'Exp9072', '2024-12-11 22:47:21', 5599000.00, 'paid', 'sedang dikirim'),
(22, 'aaaa@aaaa.com', '2024-12-11 23:47:20', 90000000.00, 'paid', 'sedang dikirim'),
(26, 'aaaa@aaaa.com', '2024-12-12 08:43:32', 2599000.00, 'paid', 'sedang dikirim'),
(27, 'aaaa@aaaa.com', '2024-12-12 13:12:24', 20999900.00, 'paid', 'sedang dikirim'),
(29, 'aaaa@aaaa.com', '2024-12-12 13:47:20', 4559720.00, 'paid', 'sedang dikirim'),
(30, 'aaaa@aaaa.com', '2024-12-12 13:50:05', 6299860.00, 'paid', 'sudah dikirim'),
(31, 'aaaa@aaaa.com', '2024-12-12 13:50:28', 2799860.00, 'paid', 'sudah dikirim'),
(32, 'aaaa@aaaa.com', '2024-12-12 13:50:59', 2800000.00, 'paid', 'sudah dikirim'),
(33, 'aaaa@aaaa.com', '2024-12-12 13:52:12', 5604000.00, 'unpaid', 'belum dikirim'),
(34, 'aaaa@aaaa.com', '2024-12-12 14:01:34', 16799720.00, 'paid', 'sudah dikirim'),
(35, 'Exp9072', '2024-12-12 14:12:46', 6299860.00, 'paid', 'sudah dikirim'),
(36, 'aaaa@aaaa.com', '2024-12-12 15:07:22', 73699660.00, 'paid', 'belum dikirim'),
(37, 'jodyislami103@gmail.com', '2024-12-12 19:39:21', 1399000.00, 'unpaid', 'belum dikirim'),
(38, 'jodyislami103@gmail.com', '2024-12-12 19:43:00', 1159000.00, 'unpaid', 'belum dikirim'),
(39, 'jodyislami103@gmail.com', '2024-12-12 19:44:55', 17999900.00, 'unpaid', 'belum dikirim'),
(40, 'jodyislami103@gmail.com', '2024-12-12 19:46:31', 17999900.00, 'unpaid', 'belum dikirim'),
(41, 'jodyislami103@gmail.com', '2024-12-12 19:48:08', 9999900.00, 'unpaid', 'belum dikirim'),
(42, 'jodyislami103@gmail.com', '2024-12-12 19:49:44', 9999900.00, 'unpaid', 'belum dikirim'),
(43, 'jodyislami103@gmail.com', '2024-12-12 19:51:38', 20999900.00, 'unpaid', 'belum dikirim'),
(44, 'jodyislami103@gmail.com', '2024-12-12 19:53:18', 20999900.00, 'paid', 'sedang dikirim'),
(45, 'jodyislami103@gmail.com', '2024-12-12 19:54:30', 66699760.00, 'paid', 'sedang dikirim'),
(46, 'jodyislami103@gmail.com', '2024-12-12 20:24:08', 1259860.00, 'paid', 'sedang dikirim'),
(47, 'jodyislami103@gmail.com', '2024-12-12 20:27:50', 38014860.00, 'paid', 'sedang dikirim'),
(48, 'jodyislami103@gmail.com', '2024-12-12 20:33:50', 14985000.00, 'unpaid', 'belum dikirim'),
(49, 'jodyislami103@gmail.com', '2024-12-12 21:31:59', 45699860.00, 'paid', 'sedang dikirim'),
(50, 'jodyislami103@gmail.com', '2024-12-12 22:27:59', 5499000.00, 'unpaid', 'belum dikirim'),
(51, 'jodyislami103@gmail.com', '2024-12-13 00:08:16', 9799860.00, 'paid', 'sedang dikirim'),
(52, 'jodyislami103@gmail.com', '2024-12-13 00:10:10', 8299000.00, 'paid', 'belum dikirim'),
(53, 'jodyislami103@gmail.com', '2024-12-13 00:11:49', 5604000.00, 'paid', 'belum dikirim'),
(54, 'jodyislami103@gmail.com', '2024-12-13 00:12:53', 1159000.00, 'paid', 'sedang dikirim'),
(55, 'jodyislami103@gmail.com', '2024-12-13 00:15:45', 1159000.00, 'paid', 'belum dikirim'),
(56, 'jodyislami103@gmail.com', '2024-12-13 00:17:31', 14985000.00, 'paid', 'belum dikirim'),
(57, 'jodyislami103@gmail.com', '2024-12-13 00:20:04', 45699860.00, 'paid', 'sedang dikirim'),
(58, 'jodyislami103@gmail.com', '2024-12-13 01:48:46', 90000000.00, 'paid', 'sedang dikirim'),
(59, 'aaaa@aaaa.com', '2024-12-13 01:49:22', 26501000.00, 'paid', 'belum dikirim'),
(60, 'jodyislami103@gmail.com', '2024-12-13 02:42:41', 1599000.00, 'paid', 'sudah dikirim'),
(61, 'jodyislami103@gmail.com', '2024-12-13 02:50:45', 18999900.00, 'paid', 'sudah dikirim'),
(62, 'jodyislami103@gmail.com', '2024-12-13 02:57:36', 6299860.00, 'paid', 'sudah dikirim'),
(63, 'aaaa@aaaa.com', '2024-12-13 08:14:18', 14985000.00, 'paid', 'sudah dikirim'),
(64, 'aaaa@aaaa.com', '2024-12-13 08:14:36', 25197000.00, 'unpaid', 'belum dikirim'),
(65, 'aaaa@aaaa.com', '2024-12-13 08:14:48', 24084860.00, 'unpaid', 'belum dikirim'),
(66, 'jodyislami103@gmail.com', '2024-12-13 13:36:41', 18999900.00, 'paid', 'sedang dikirim'),
(68, 'jodyislami103@gmail.com', '2024-12-13 14:37:39', 6299860.00, 'paid', 'belum dikirim'),
(69, 'jodyislami103@gmail.com', '2024-12-13 15:09:58', 90000000.00, 'paid', 'sedang dikirim'),
(70, 'aaaa@aaaa.com', '2024-12-15 20:00:36', 45699860.00, 'paid', 'belum dikirim');

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
(74, 13, 10, 1, 45699860.00),
(75, 14, 29, 1, 18999900.00),
(76, 15, 9, 1, 90000000.00),
(77, 15, 2, 1, 6299860.00),
(78, 15, 14, 1, 5499000.00),
(100, 19, 64, 1, 5500000.00),
(101, 19, 20, 1, 3099000.00),
(102, 19, 6, 1, 2519860.00),
(103, 19, 62, 1, 16000000.00),
(104, 19, 63, 1, 3000000.00),
(105, 19, 39, 1, 899000.00),
(106, 19, 23, 1, 1399000.00),
(107, 19, 50, 1, 1799000.00),
(108, 20, 4, 1, 9099860.00),
(109, 21, 16, 1, 5599000.00),
(110, 22, 9, 1, 90000000.00),
(121, 26, 19, 1, 2599000.00),
(122, 27, 30, 1, 20999900.00),
(131, 29, 5, 1, 1259860.00),
(132, 29, 12, 1, 3299860.00),
(133, 30, 2, 1, 6299860.00),
(134, 31, 7, 1, 2799860.00),
(135, 32, 8, 1, 2800000.00),
(136, 33, 13, 1, 5604000.00),
(137, 34, 1, 1, 6999860.00),
(138, 34, 3, 1, 9799860.00),
(139, 35, 2, 1, 6299860.00),
(140, 36, 10, 1, 45699860.00),
(141, 36, 32, 1, 9999900.00),
(142, 36, 31, 1, 17999900.00),
(143, 37, 23, 1, 1399000.00),
(144, 38, 18, 1, 1159000.00),
(145, 39, 31, 1, 17999900.00),
(146, 40, 31, 1, 17999900.00),
(147, 41, 32, 1, 9999900.00),
(148, 42, 32, 1, 9999900.00),
(149, 43, 30, 1, 20999900.00),
(150, 44, 30, 1, 20999900.00),
(151, 45, 30, 1, 20999900.00),
(152, 45, 10, 1, 45699860.00),
(153, 46, 5, 1, 1259860.00),
(154, 47, 15, 1, 8299000.00),
(155, 47, 20, 1, 3099000.00),
(156, 47, 6, 1, 2519860.00),
(157, 47, 97, 1, 17000000.00),
(158, 47, 98, 1, 2500000.00),
(159, 47, 35, 1, 599000.00),
(160, 47, 22, 1, 1599000.00),
(161, 47, 47, 1, 2399000.00),
(162, 48, 11, 1, 14985000.00),
(163, 49, 10, 1, 45699860.00),
(164, 50, 14, 1, 5499000.00),
(165, 51, 3, 1, 9799860.00),
(166, 52, 15, 1, 8299000.00),
(167, 53, 13, 1, 5604000.00),
(168, 54, 18, 1, 1159000.00),
(169, 55, 18, 1, 1159000.00),
(170, 56, 11, 1, 14985000.00),
(171, 57, 10, 1, 45699860.00),
(172, 58, 9, 1, 90000000.00),
(173, 59, 59, 1, 4200000.00),
(174, 59, 13, 1, 5604000.00),
(175, 59, 71, 1, 3000000.00),
(176, 59, 102, 1, 5000000.00),
(177, 59, 73, 1, 3800000.00),
(178, 59, 36, 1, 1599000.00),
(179, 59, 56, 1, 899000.00),
(180, 59, 47, 1, 2399000.00),
(181, 60, 41, 1, 1599000.00),
(182, 61, 29, 1, 18999900.00),
(183, 62, 2, 1, 6299860.00),
(184, 63, 11, 1, 14985000.00),
(185, 64, 59, 1, 4200000.00),
(186, 64, 60, 1, 3500000.00),
(187, 64, 61, 1, 2500000.00),
(188, 64, 109, 1, 8100000.00),
(189, 64, 93, 1, 1000000.00),
(190, 64, 36, 1, 1599000.00),
(191, 64, 54, 1, 1899000.00),
(192, 64, 47, 1, 2399000.00),
(193, 65, 11, 1, 14985000.00),
(194, 65, 4, 1, 9099860.00),
(195, 66, 29, 1, 18999900.00),
(197, 68, 2, 1, 6299860.00),
(198, 69, 9, 1, 90000000.00),
(199, 70, 10, 1, 45699860.00);

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
(6, 6, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-05 21:00:37', 18619580.00),
(7, 13, 'Exp9072', 'credit-card', '2024-12-10 14:05:57', 45699860.00),
(8, 14, 'Exp9072', 'bank-transfer', '2024-12-10 22:57:21', 18999900.00),
(9, 15, 'Exp9072', 'bank-transfer', '2024-12-11 12:43:00', 99999999.99),
(10, 19, 'Exp9072', 'credit-card', '2024-12-11 12:56:22', 34215860.00),
(11, 20, 'Exp9072', 'bank-transfer', '2024-12-11 22:39:35', 9099860.00),
(12, 21, 'Exp9072', 'bank-transfer', '2024-12-11 22:47:25', 5599000.00),
(13, 22, 'aaaa@aaaa.com', 'bank-transfer', '2024-12-11 23:47:24', 90000000.00),
(14, 26, 'aaaa@aaaa.com', 'credit-card', '2024-12-12 08:46:48', 2599000.00),
(15, 27, 'aaaa@aaaa.com', 'credit-card', '2024-12-12 13:12:28', 20999900.00),
(16, 29, 'aaaa@aaaa.com', 'bank-transfer', '2024-12-12 13:47:28', 4559720.00),
(17, 30, 'aaaa@aaaa.com', 'credit-card', '2024-12-12 13:50:13', 6299860.00),
(18, 31, 'aaaa@aaaa.com', 'bank-transfer', '2024-12-12 13:50:33', 2799860.00),
(19, 32, 'aaaa@aaaa.com', 'bank-transfer', '2024-12-12 13:51:20', 2800000.00),
(20, 34, 'aaaa@aaaa.com', 'ewallet', '2024-12-12 14:01:51', 16799720.00),
(21, 35, 'Exp9072', 'credit-card', '2024-12-12 14:12:54', 6299860.00),
(22, 45, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-12 19:54:35', 0.00),
(23, 44, 'jodyislami103@gmail.com', 'credit-card', '2024-12-12 20:16:34', 20999900.00),
(24, 46, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-12 20:24:12', 1259860.00),
(25, 47, 'jodyislami103@gmail.com', 'ewallet', '2024-12-12 20:27:54', 38014860.00),
(26, 49, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-12 21:32:02', 45699860.00),
(27, 51, 'jodyislami103@gmail.com', 'ewallet', '2024-12-13 00:08:19', 9799860.00),
(28, 52, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-13 00:10:12', 8299000.00),
(29, 53, 'jodyislami103@gmail.com', 'ewallet', '2024-12-13 00:11:51', 5604000.00),
(30, 54, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 00:12:56', 1159000.00),
(31, 55, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 00:15:49', 1159000.00),
(32, 56, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 00:17:36', 14985000.00),
(33, 57, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 00:20:07', 45699860.00),
(34, 58, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 01:48:50', 90000000.00),
(35, 59, 'aaaa@aaaa.com', 'bank-transfer', '2024-12-13 01:49:27', 26501000.00),
(36, 36, 'aaaa@aaaa.com', 'credit-card', '2024-12-13 01:49:33', 73699660.00),
(37, 60, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 02:42:45', 1599000.00),
(38, 61, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 02:50:49', 18999900.00),
(39, 62, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 02:57:43', 6299860.00),
(40, 63, 'aaaa@aaaa.com', 'credit-card', '2024-12-13 08:14:22', 14985000.00),
(41, 66, 'jodyislami103@gmail.com', 'credit-card', '2024-12-13 13:36:48', 18999900.00),
(42, 68, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-13 14:37:46', 6299860.00),
(43, 69, 'jodyislami103@gmail.com', 'bank-transfer', '2024-12-13 15:12:06', 90000000.00),
(44, 70, 'aaaa@aaaa.com', 'bank-transfer', '2024-12-15 20:00:40', 45699860.00);

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
(1, 'Admin1', 'admin1@simtech.com', 'admin1', 'admin', NULL, NULL, NULL),
(2, 'User Admin1', 'user-admin1@simtech.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'user-admin', NULL, NULL, NULL),
(3, 'User2', 'user2@simtech.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'user', NULL, NULL, NULL),
(7, 'Muhammad Jody Putra Islami', 'jodyislami103@gmail.com', NULL, 'user', 'google', '101863837434744365423', 'https://lh3.googleusercontent.com/a/ACg8ocJd4G_mszuLRmyQ6x4oo_CLBRLRa6KSP6b6prmGa01-TWZ1Zmt_=s96-c'),
(8, 'Jody', 'Exp9072', NULL, 'user', 'github', '59360084', 'https://avatars.githubusercontent.com/u/59360084?v=4'),
(9, 'Jodyyy', 'jodi@cls-v2.com', 'jody123', 'user', NULL, NULL, NULL),
(10, 'aa', 'aaaa@aaaa.com', 'aa', 'user', NULL, NULL, NULL),
(11, 'abcd', 'abcd@abcd.com', '12345678', 'user', NULL, NULL, NULL),
(12, 'faishal', 'faishal@simtech.com', 'faishal', 'user', NULL, NULL, NULL);

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
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
