CREATE TYPE "public"."application_status" AS ENUM('pending', 'hired', 'interviewing', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TABLE "applied_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_profile_id" uuid NOT NULL,
	"application_status" "application_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applied_jobs" ADD CONSTRAINT "applied_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applied_jobs" ADD CONSTRAINT "applied_jobs_job_profile_id_job_posting_id_fk" FOREIGN KEY ("job_profile_id") REFERENCES "public"."job_posting"("id") ON DELETE no action ON UPDATE no action;