CREATE TABLE `user` (
	`id` varchar(128) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`image` varchar(255),
	`provider` varchar(255),
	`provider_account_id` varchar(255),
	`role` enum('USER','SUPER_ADMIN') NOT NULL DEFAULT 'USER',
	`user_status` enum('PENDING','REGISTERED') NOT NULL DEFAULT 'PENDING',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
