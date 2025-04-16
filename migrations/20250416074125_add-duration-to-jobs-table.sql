CREATE TYPE "public"."duration_unit" AS ENUM('week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."duration_value" AS ENUM('1', '2', '3', '4', '5', '6+');--> statement-breakpoint
ALTER TABLE "job_posting" ADD COLUMN "duration_value" "duration_value" NOT NULL;--> statement-breakpoint
ALTER TABLE "job_posting" ADD COLUMN "duration_unit" "duration_unit" NOT NULL;