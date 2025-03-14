CREATE TABLE `class` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`thumbnail_url` text,
	`status` enum('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `class_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `sub_class` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`order_index` int NOT NULL,
	`video_url` text,
	`video_status` enum('UPLOADING','UPLOADED','FAILED') DEFAULT 'UPLOADING',
	`thumbnail_url` text,
	`class_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sub_class_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_id_slug_unique` UNIQUE(`class_id`,`slug`)
);
--> statement-breakpoint
CREATE INDEX `class_id_order_index` ON `sub_class` (`class_id`,`order_index`);