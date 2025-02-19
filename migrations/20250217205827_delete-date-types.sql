ALTER TABLE "cv" ALTER COLUMN "full_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cv" ALTER COLUMN "skill_title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "education" ALTER COLUMN "gpa" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "project_link" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "education" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "education" DROP COLUMN "end_date";--> statement-breakpoint
ALTER TABLE "work_experience" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "work_experience" DROP COLUMN "end_date";