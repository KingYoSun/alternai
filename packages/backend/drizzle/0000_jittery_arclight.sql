CREATE TABLE `images` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`storage` enum('local','nextcloud'),
	`path` varchar(255) NOT NULL,
	CONSTRAINT `images_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`storage`,`path`)
);
