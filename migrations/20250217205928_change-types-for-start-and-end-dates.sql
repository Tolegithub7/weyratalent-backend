ALTER TABLE "education" ADD COLUMN "start_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "end_date" timestamp;--> statement-breakpoint
ALTER TABLE "work_experience" ADD COLUMN "start_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "work_experience" ADD COLUMN "end_date" timestamp;