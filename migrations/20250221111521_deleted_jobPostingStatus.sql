CREATE TYPE "public"."status" AS ENUM('active', 'expired');--> statement-breakpoint
ALTER TABLE "job_posting" DROP COLUMN "status";