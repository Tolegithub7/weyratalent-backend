ALTER TABLE "users" RENAME COLUMN "last_name" TO "full_name";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_name" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verified_license" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "agree_terms_service" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");