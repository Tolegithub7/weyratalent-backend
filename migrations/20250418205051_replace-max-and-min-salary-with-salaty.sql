ALTER TABLE "job_posting" ADD COLUMN "salary" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "job_posting" DROP COLUMN "min_salary";--> statement-breakpoint
ALTER TABLE "job_posting" DROP COLUMN "max_salary";