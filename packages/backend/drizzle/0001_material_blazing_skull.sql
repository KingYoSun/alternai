ALTER TABLE `images` MODIFY COLUMN `created_at` datetime;--> statement-breakpoint
ALTER TABLE `tags` MODIFY COLUMN `created_at` datetime;--> statement-breakpoint
ALTER TABLE `tags` MODIFY COLUMN `updated_at` datetime;--> statement-breakpoint
ALTER TABLE `wiki_pages` MODIFY COLUMN `created_at` datetime;--> statement-breakpoint
ALTER TABLE `wiki_pages` MODIFY COLUMN `updated_at` datetime;