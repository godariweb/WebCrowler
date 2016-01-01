-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 01, 2016 at 11:10 PM
-- Server version: 5.5.46-0ubuntu0.14.04.2
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `web_crowler`
--

-- --------------------------------------------------------

--
-- Table structure for table `links_crawled`
--

CREATE TABLE IF NOT EXISTS `links_crawled` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `website_id` int(11) NOT NULL,
  `link` varchar(3000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `website_id` (`website_id`,`link`(255))
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10576 ;

-- --------------------------------------------------------

--
-- Table structure for table `page`
--

CREATE TABLE IF NOT EXISTS `page` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `website_id` int(11) unsigned NOT NULL,
  `uri` varchar(3000) NOT NULL,
  `content` longtext NOT NULL,
  `content_text` longtext NOT NULL,
  `added` datetime NOT NULL,
  `views` int(11) unsigned NOT NULL,
  `shares` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `website_id` (`website_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8793 ;

-- --------------------------------------------------------

--
-- Table structure for table `website`
--

CREATE TABLE IF NOT EXISTS `website` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `uri` varchar(3000) NOT NULL,
  `description` text NOT NULL,
  `views` int(11) unsigned NOT NULL COMMENT 'Views per day.',
  `rank` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `website`
--

INSERT INTO `website` (`id`, `name`, `uri`, `description`, `views`, `rank`) VALUES
(2, 'NBC News - Breaking News', 'http://www.nbcnews.com/', 'Go to NBCNews.com for breaking news, videos, and the latest top stories in world news, business, politics, health and pop culture.', 250, 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
