CREATE TABLE `practice_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`device_hash` text NOT NULL,
	`topic` text NOT NULL,
	`transcript` text NOT NULL,
	`elapsed` integer NOT NULL,
	`model` text NOT NULL,
	`analysis_json` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `practice_sessions_device_created_idx` ON `practice_sessions` (`device_hash`,`created_at`);