CREATE TABLE `user_token` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_token_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `user_token` ADD CONSTRAINT `user_token_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;