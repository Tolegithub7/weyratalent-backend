ALTER TABLE "employer_profile" ALTER COLUMN "banner_url" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "employer_profile" ALTER COLUMN "company_name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "employer_profile" ALTER COLUMN "about" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "employer_profile" ALTER COLUMN "location" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "employer_profile" ALTER COLUMN "phone_number" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "employer_profile" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "logo_url" varchar(255);--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "organization_type" "organization_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "industry_type" "industry_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "team_size" "team_size" NOT NULL;--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "year_established" varchar(4) NOT NULL;--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "website" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "company_vision" text NOT NULL;--> statement-breakpoint
ALTER TABLE "employer_profile" ADD COLUMN "social_links" jsonb DEFAULT '{}'::jsonb;