CREATE TABLE `tags_to_wiki_pages` (
	`tag_id` bigint unsigned NOT NULL,
	`wiki_page_id` bigint unsigned NOT NULL,
	CONSTRAINT `tags_to_wiki_pages_tag_id_wiki_page_id_pk` PRIMARY KEY(`tag_id`,`wiki_page_id`)
);
--> statement-breakpoint
ALTER TABLE `tags_to_wiki_pages` ADD CONSTRAINT `tags_to_wiki_pages_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tags_to_wiki_pages` ADD CONSTRAINT `tags_to_wiki_pages_wiki_page_id_tags_id_fk` FOREIGN KEY (`wiki_page_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;