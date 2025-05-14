CREATE TABLE `user_class_access` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`class_id` int NOT NULL,
	`duration_days` int NOT NULL,
	`granted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expires_at` timestamp NOT NULL,
	`status` enum('ACTIVE','EXPIRED','REVOKED') NOT NULL DEFAULT 'ACTIVE',
	`granted_by_user_id` varchar(128),
	`notes` text,
	`notification_sent` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_class_access_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_class_unique` UNIQUE(`user_id`,`class_id`)
);
--> statement-breakpoint
ALTER TABLE `user_class_access` ADD CONSTRAINT `user_class_access_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_class_access` ADD CONSTRAINT `user_class_access_class_id_class_id_fk` FOREIGN KEY (`class_id`) REFERENCES `class`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_class_access` ADD CONSTRAINT `user_class_access_granted_by_user_id_user_id_fk` FOREIGN KEY (`granted_by_user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_id_index` ON `user_class_access` (`user_id`);--> statement-breakpoint
CREATE INDEX `class_id_index` ON `user_class_access` (`class_id`);--> statement-breakpoint
CREATE INDEX `expires_at_index` ON `user_class_access` (`expires_at`);