CREATE TABLE `trx` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`trxId` varchar(256),
	`amount` int NOT NULL,
	`from` varchar(256),
	`to` varchar(256),
	`item` varchar(256),
	`isLoad` boolean DEFAULT false);

CREATE TABLE `user` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`userId` varchar(256),
	`name` varchar(256),
	`email` varchar(256),
	`balance` int DEFAULT 0);
