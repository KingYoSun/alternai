CREATE TABLE `categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`storage` enum('local','nextcloud'),
	`path` varchar(255) NOT NULL,
	`created_at` date,
	CONSTRAINT `images_id` PRIMARY KEY(`id`),
	CONSTRAINT `storage_path_idx` UNIQUE(`storage`,`path`)
);
--> statement-breakpoint
CREATE TABLE `images_to_tags` (
	`image_id` bigint unsigned NOT NULL,
	`tag_id` bigint unsigned NOT NULL,
	CONSTRAINT `images_to_tags_image_id_tag_id_pk` PRIMARY KEY(`image_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`text` text NOT NULL,
	`is_negative` boolean DEFAULT false,
	CONSTRAINT `prompts_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `prompts_to_tags` (
	`prompt_id` bigint unsigned NOT NULL,
	`tag_id` bigint unsigned NOT NULL,
	CONSTRAINT `prompts_to_tags_prompt_id_tag_id_pk` PRIMARY KEY(`prompt_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tag_groups` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category_id` bigint unsigned NOT NULL,
	CONSTRAINT `tag_groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('General','Artist','Copyright','Character','Meta'),
	`post_count` int,
	`is_locked` boolean DEFAULT false,
	`is_deprecated` boolean DEFAULT false,
	`words` json,
	`created_at` date,
	`updated_at` date,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `tags_to_tag_groups` (
	`tag_id` bigint unsigned NOT NULL,
	`tag_group_id` bigint unsigned NOT NULL,
	CONSTRAINT `tags_to_tag_groups_tag_id_tag_group_id_pk` PRIMARY KEY(`tag_id`,`tag_group_id`)
);
--> statement-breakpoint
CREATE TABLE `wiki_pages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`text` text NOT NULL,
	`other_names` json,
	`is_deleted` boolean DEFAULT false,
	`locked` boolean DEFAULT false,
	`created_at` date,
	`updated_at` date,
	CONSTRAINT `wiki_pages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `is_negative_idx` ON `prompts` (`is_negative`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `tags` (`category`);--> statement-breakpoint
ALTER TABLE `images_to_tags` ADD CONSTRAINT `images_to_tags_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images_to_tags` ADD CONSTRAINT `images_to_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompts_to_tags` ADD CONSTRAINT `prompts_to_tags_prompt_id_prompts_id_fk` FOREIGN KEY (`prompt_id`) REFERENCES `prompts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompts_to_tags` ADD CONSTRAINT `prompts_to_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tag_groups` ADD CONSTRAINT `tag_groups_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tags_to_tag_groups` ADD CONSTRAINT `tags_to_tag_groups_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tags_to_tag_groups` ADD CONSTRAINT `tags_to_tag_groups_tag_group_id_tags_id_fk` FOREIGN KEY (`tag_group_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;