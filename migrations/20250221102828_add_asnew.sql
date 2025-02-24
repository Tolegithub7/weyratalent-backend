ALTER TABLE "employer_profile" RENAME COLUMN "company_vision" TO "vision";--> statement-breakpoint
ALTER TABLE "employer_profile" RENAME COLUMN "social_links" TO "instagram_link";--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "telegram_link" varchar(50);--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "facebook_link" varchar(50);--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "X_link" varchar(50);