ALTER TABLE "public"."job_posting" ALTER COLUMN "salary_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."salary_type";--> statement-breakpoint
CREATE TYPE "public"."salary_type" AS ENUM('Hourly', 'Fixed');--> statement-breakpoint
ALTER TABLE "public"."job_posting" ALTER COLUMN "salary_type" SET DATA TYPE "public"."salary_type" USING "salary_type"::"public"."salary_type";