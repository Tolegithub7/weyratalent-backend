CREATE TYPE "public"."categories" AS ENUM('frontend', 'backend', 'graphics design', 'fullstack', 'devops', 'game', 'machine learning', 'AI', 'mobile');--> statement-breakpoint
CREATE TYPE "public"."experience" AS ENUM('0-2', '2-4', '5-6', '6+', 'intern');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'talent', 'recruiter');--> statement-breakpoint
CREATE TABLE "cv" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text,
	"user_id" uuid NOT NULL,
	"skill_title" text,
	"hourly_rate" integer DEFAULT 0 NOT NULL,
	"categories" "categories" NOT NULL,
	CONSTRAINT "cv_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"degree" varchar(255) NOT NULL,
	"institution" varchar(255) NOT NULL,
	"start_date" varchar(10),
	"end_date" varchar(10),
	"gpa" double precision DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"description" text NOT NULL,
	"project_link" varchar(55) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talent_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_url" text,
	"full_name" text NOT NULL,
	"user_id" uuid NOT NULL,
	"nationality" text NOT NULL,
	"dob" date NOT NULL,
	"gender" "gender" NOT NULL,
	"experience" "experience" NOT NULL,
	"social_link" varchar(30),
	"about" text,
	CONSTRAINT "talent_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" varchar(50) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"password" text NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "work_experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"job_title" varchar(50) NOT NULL,
	"company" varchar(55) NOT NULL,
	"start_date" varchar(10),
	"end_date" varchar(10)
);
--> statement-breakpoint
ALTER TABLE "cv" ADD CONSTRAINT "cv_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_cv_id_cv_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_cv_id_cv_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_profile" ADD CONSTRAINT "talent_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_cv_id_cv_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv"("id") ON DELETE no action ON UPDATE no action;