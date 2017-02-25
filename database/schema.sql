
CREATE DATABASE IF NOT EXISTS `web_crowler`;

USE `web_crowler`;

## Create website table ##
CREATE TABLE IF NOT EXISTS `website` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(500) NOT NULL DEFAULT '',
	`uri` VARCHAR(3000) NOT NULL DEFAULT '',
	`description` TEXT NOT NULL,
	`views` INT(11) NOT NULL,
	`rank` INT(11) NOT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=0;


## Create page table ##
CREATE TABLE IF NOT EXISTS `page` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`website_id`INT(11) NOT NULL,
	`uri` VARCHAR(3000) NOT NULL DEFAULT '',
	`content` LONGTEXT NOT NULL,
	`content_text` LONGTEXT NOT NULL,
	`added` DATETIME,
	`views` INT(11) NOT NULL,
	`shares` INT(11) NOT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=0;


## Create links_crawled table ##
CREATE TABLE IF NOT EXISTS `links_crawled` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`website_id`INT(11) NOT NULL,
	`link` VARCHAR(3000) NOT NULL DEFAULT '',
	PRIMARY KEY (`id`)
)
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB
	AUTO_INCREMENT=0;