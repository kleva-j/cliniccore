CREATE TABLE `patient_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patient_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `patient_accounts_patientId_unique` UNIQUE(`patientId`),
	CONSTRAINT `patient_accounts_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `patient_accounts_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','receptionist','doctor','patient') NOT NULL DEFAULT 'patient';