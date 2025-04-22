CREATE TABLE "blog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"blog_pic_url" text,
	"blog_header" text,
	"blog_body" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "otp" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ALTER COLUMN "otp" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "job_posting" ADD COLUMN "salary" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_posting" DROP COLUMN "min_salary";--> statement-breakpoint
ALTER TABLE "job_posting" DROP COLUMN "max_salary";