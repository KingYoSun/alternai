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
	CONSTRAINT `images_id` PRIMARY KEY(`id`),
	CONSTRAINT `storage_path_idx` UNIQUE(`storage`,`path`)
);
--> statement-breakpoint
CREATE TABLE `images_to_keywords` (
	`image_id` bigint unsigned NOT NULL,
	`keyword_id` bigint unsigned NOT NULL,
	CONSTRAINT `images_to_keywords_image_id_keyword_id_pk` PRIMARY KEY(`image_id`,`keyword_id`)
);
--> statement-breakpoint
CREATE TABLE `keywords` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `keywords_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `keywords_to_tags` (
	`keyword_id` bigint unsigned NOT NULL,
	`tag_id` bigint unsigned NOT NULL,
	CONSTRAINT `keywords_to_tags_keyword_id_tag_id_pk` PRIMARY KEY(`keyword_id`,`tag_id`)
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
CREATE TABLE `prompts_to_keywords` (
	`prompt_id` bigint unsigned NOT NULL,
	`keyword_id` bigint unsigned NOT NULL,
	CONSTRAINT `prompts_to_keywords_prompt_id_keyword_id_pk` PRIMARY KEY(`prompt_id`,`keyword_id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category_id` bigint unsigned NOT NULL,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `images_to_keywords` ADD CONSTRAINT `images_to_keywords_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images_to_keywords` ADD CONSTRAINT `images_to_keywords_keyword_id_keywords_id_fk` FOREIGN KEY (`keyword_id`) REFERENCES `keywords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `keywords_to_tags` ADD CONSTRAINT `keywords_to_tags_keyword_id_keywords_id_fk` FOREIGN KEY (`keyword_id`) REFERENCES `keywords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `keywords_to_tags` ADD CONSTRAINT `keywords_to_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompts_to_keywords` ADD CONSTRAINT `prompts_to_keywords_prompt_id_prompts_id_fk` FOREIGN KEY (`prompt_id`) REFERENCES `prompts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompts_to_keywords` ADD CONSTRAINT `prompts_to_keywords_keyword_id_keywords_id_fk` FOREIGN KEY (`keyword_id`) REFERENCES `keywords`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tags` ADD CONSTRAINT `tags_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;