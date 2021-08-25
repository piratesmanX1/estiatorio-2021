-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 16, 2021 at 02:34 PM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `estiatorio`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_log`
--

DROP TABLE IF EXISTS `account_log`;
CREATE TABLE IF NOT EXISTS `account_log` (
  `acclog_id` int(11) NOT NULL AUTO_INCREMENT,
  `log_status` char(1) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `affected_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `decider_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`acclog_id`),
  KEY `decider_id` (`decider_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account_log`
--

INSERT INTO `account_log` (`acclog_id`, `log_status`, `user_id`, `affected_date`, `decider_id`) VALUES
(37, '0', 28, '2021-07-13 14:36:52', 15),
(38, '0', 29, '2021-07-14 01:09:37', 15),
(39, '0', 30, '2021-07-14 02:29:19', 15);

-- --------------------------------------------------------

--
-- Table structure for table `region`
--

DROP TABLE IF EXISTS `region`;
CREATE TABLE IF NOT EXISTS `region` (
  `region_id` int(11) NOT NULL AUTO_INCREMENT,
  `region_name` varchar(255) NOT NULL,
  PRIMARY KEY (`region_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `region`
--

INSERT INTO `region` (`region_id`, `region_name`) VALUES
(3, 'Johor'),
(10, 'Selangor'),
(14, 'Melaka');

-- --------------------------------------------------------

--
-- Table structure for table `reservation_log`
--

DROP TABLE IF EXISTS `reservation_log`;
CREATE TABLE IF NOT EXISTS `reservation_log` (
  `reservation_id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_time` datetime NOT NULL,
  `table_number` decimal(60,0) NOT NULL,
  `status` char(1) NOT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `restaurant_id` (`restaurant_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reservation_log`
--

INSERT INTO `reservation_log` (`reservation_id`, `reservation_time`, `table_number`, `status`, `restaurant_id`, `user_id`) VALUES
(73, '2021-06-09 12:30:00', '3', '2', 1, 16),
(74, '2021-06-01 14:30:00', '2', '2', 1, 16),
(75, '2021-05-10 04:30:00', '1', '2', 1, 16),
(76, '2021-04-03 08:30:00', '3', '2', 1, 16),
(77, '2021-07-30 12:30:00', '3', '2', 1, 16),
(78, '2021-07-27 14:30:00', '2', '1', 1, 16),
(79, '2021-07-26 04:30:00', '1', '1', 1, 16),
(80, '2021-07-25 08:30:00', '3', '1', 1, 16);

-- --------------------------------------------------------

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
CREATE TABLE IF NOT EXISTS `restaurant` (
  `restaurant_id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant_logo` text NOT NULL,
  `restaurant_name` varchar(255) NOT NULL,
  `restaurant_description` text NOT NULL,
  `restaurant_address` text NOT NULL,
  `reservation_fee` decimal(15,2) NOT NULL,
  `seat_capacity` decimal(60,0) NOT NULL,
  `status` char(1) NOT NULL,
  `region_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`restaurant_id`),
  KEY `region_id` (`region_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `restaurant`
--

INSERT INTO `restaurant` (`restaurant_id`, `restaurant_logo`, `restaurant_name`, `restaurant_description`, `restaurant_address`, `reservation_fee`, `seat_capacity`, `status`, `region_id`, `user_id`) VALUES
(1, 'assets/image/uploaded_img/1626384812.png', 'KFC', 'Finger lickin good!', 'Lot PT 43, Km 47, Kuala Lumpur-Seremban', '10.00', '7', '0', 10, 28),
(3, 'assets/image/uploaded_img/1626196252.png', 'Black Mary', 'Serving the best mysterious food.', 'Taman Sri Idaman, Lorong Kelompang, Alor Setar, Kedah', '10.00', '30', '0', 3, 29);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_image` text,
  `username` varchar(25555) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` char(1) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `dob` datetime DEFAULT NULL,
  `role` char(1) NOT NULL,
  `status` char(1) NOT NULL,
  `registered_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `profile_image`, `username`, `password`, `email`, `first_name`, `last_name`, `gender`, `phone_number`, `dob`, `role`, `status`, `registered_date`, `last_login`) VALUES
(15, 'assets/image/uploaded_img/1625716590.png', 'piratesmanX1', 'ed9d16c84f1354106a63ac7975d18014', 'joeshern123@gmail.com', 'Ooi', 'Admin', '0', '0104583822', '2002-07-08 00:00:00', '0', '0', '2021-07-08 11:56:30', '2021-07-14 19:51:28'),
(16, 'assets/image/uploaded_img/1626019442.jpg', 'piratesmanX2', 'ed9d16c84f1354106a63ac7975d18014', 'joeshern123lj@gmail.com', 'Customer', 'Josh', '1', '0104583823', '1998-07-06 00:00:00', '1', '0', '2021-07-08 11:57:48', '2021-07-14 21:09:32'),
(28, 'assets/image/uploaded_img/1626158165.jpg', 'piratesmanX3', 'ed9d16c84f1354106a63ac7975d18014', 'joeshern123@hotmail.com', 'Nikola', 'Tesla', '0', '0104583822', '1995-07-13 00:00:00', '2', '0', '2021-07-13 14:36:04', '2021-07-14 21:36:37'),
(29, 'assets/image/uploaded_img/1626196128.png', 'piratesmanX5', 'ed9d16c84f1354106a63ac7975d18014', 'joeshern123lj@hotmail.com', 'Dio', 'Joseph', '1', '0104583822', '2000-07-14 00:00:00', '2', '0', '2021-07-14 01:08:48', '2021-07-14 01:10:01'),
(30, 'assets/image/uploaded_img/1626200940.jpg', 'piratesmanX6', 'ed9d16c84f1354106a63ac7975d18014', 'haloshern123@hotmail.com', 'Sakatomo', 'Moshiyima', '0', '0104583822', '1995-07-14 00:00:00', '2', '0', '2021-07-14 02:29:00', '2021-07-14 02:29:40');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_log`
--
ALTER TABLE `account_log`
  ADD CONSTRAINT `account_log_ibfk_1` FOREIGN KEY (`decider_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `account_log_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `reservation_log`
--
ALTER TABLE `reservation_log`
  ADD CONSTRAINT `reservation_log_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`restaurant_id`),
  ADD CONSTRAINT `reservation_log_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD CONSTRAINT `restaurant_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `region` (`region_id`),
  ADD CONSTRAINT `restaurant_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

DELIMITER $$
--
-- Events
--
DROP EVENT `auto_cancellation`$$
CREATE DEFINER=`root`@`localhost` EVENT `auto_cancellation` ON SCHEDULE EVERY 1 SECOND STARTS '2021-07-16 05:01:01' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE reservation_log SET status = 2 WHERE reservation_log.reservation_time < NOW() AND reservation_log.status = 1$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
