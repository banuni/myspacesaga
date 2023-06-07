CREATE TABLE `trx` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`amount` int NOT NULL,
	`from` int,
	`to` int,
	`item` varchar(256),
	`isLoad` boolean DEFAULT false);

CREATE TABLE `user` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(256),
	`email` varchar(256),
	`balance` int DEFAULT 0);
