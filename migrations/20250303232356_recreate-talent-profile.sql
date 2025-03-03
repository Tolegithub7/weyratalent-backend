CREATE TYPE "public"."categories" AS ENUM('frontend', 'backend', 'graphics design', 'fullstack', 'devops', 'game', 'machine learning', 'AI', 'mobile');--> statement-breakpoint
CREATE TYPE "public"."country" AS ENUM('Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cape Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe');--> statement-breakpoint
CREATE TYPE "public"."experience" AS ENUM('Entry Level', 'Mid Level', 'Senior Level');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."industry_type" AS ENUM('Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Transportation', 'Energy', 'Telecommunications', 'Construction', 'Agriculture', 'Entertainment', 'Real Estate', 'Hospitality', 'Government', 'other');--> statement-breakpoint
CREATE TYPE "public"."nationality" AS ENUM('Algerian', 'Angolan', 'Beninese', 'Botswanan', 'Burkinabé', 'Burundian', 'Cape Verdean', 'Cameroonian', 'Central African', 'Chadian', 'Comoran', 'Congolese', 'Djiboutian', 'Egyptian', 'Equatorial Guinean', 'Eritrean', 'Swazi', 'Ethiopian', 'Gabonese', 'Gambian', 'Ghanaian', 'Guinean', 'Bissau-Guinean', 'Ivorian', 'Kenyan', 'Basotho', 'Liberian', 'Libyan', 'Malagasy', 'Malawian', 'Malian', 'Mauritanian', 'Mauritian', 'Moroccan', 'Mozambican', 'Namibian', 'Nigerien', 'Nigerian', 'Rwandan', 'Santomean', 'Senegalese', 'Seychellois', 'Sierra Leonean', 'Somali', 'South African', 'South Sudanese', 'Sudanese', 'Tanzanian', 'Togolese', 'Tunisian', 'Ugandan', 'Zambian', 'Zimbabwean');--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('Private', 'Government', 'Nonprofit', 'Cooperative', 'International', 'other');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'talent', 'recruiter');--> statement-breakpoint
CREATE TYPE "public"."team_size" AS ENUM('0-10', '10-50', '50+');--> statement-breakpoint
CREATE TYPE "public"."job_level" AS ENUM('Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Director', 'Executive');--> statement-breakpoint
CREATE TYPE "public"."job_role" AS ENUM('Software Engineer', 'Data Scientist', 'Product Manager', 'Designer', 'Marketing Manager', 'Sales Representative', 'HR Manager', 'Accountant', 'Other');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance');--> statement-breakpoint
CREATE TYPE "public"."salary_type" AS ENUM('Hourly', 'fixed');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'expired');--> statement-breakpoint
CREATE TYPE "public"."vacancies" AS ENUM('1', '2', '3', '4', '5+');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('pending', 'hired', 'interviewing', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."token_type" AS ENUM('access', 'refresh');--> statement-breakpoint
CREATE TABLE "cv" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_title" text NOT NULL,
	"hourly_rate" integer DEFAULT 0 NOT NULL,
	"categories" "categories" NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "cv_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "hourly_rate_check" CHECK ("cv"."hourly_rate" >= 0 AND "cv"."hourly_rate" <= 100)
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"degree" varchar(255) NOT NULL,
	"institution" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"gpa" double precision,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "gpa_check" CHECK ("education"."gpa" >= 0 AND "education"."gpa" <= 4)
);
--> statement-breakpoint
CREATE TABLE "employer_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"logo_url" varchar(255),
	"banner_url" varchar(255) NOT NULL,
	"company_name" varchar(100) NOT NULL,
	"about" text NOT NULL,
	"location" varchar(100) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"organization_type" "organization_type" NOT NULL,
	"industry_type" "industry_type" NOT NULL,
	"team_size" "team_size" NOT NULL,
	"year_established" varchar(4) NOT NULL,
	"website" varchar(255) NOT NULL,
	"vision" text NOT NULL,
	"instagram_link" varchar(50),
	"telegram_link" varchar(50),
	"facebook_link" varchar(50),
	"X_link" varchar(50),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "employer_profile_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "employer_profile_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "favorite_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_type" "organization_type" NOT NULL,
	"industry_type" "industry_type" NOT NULL,
	"team_size" "team_size" NOT NULL,
	"company_vision" varchar(500),
	"instagram_link" varchar(50),
	"telegram_link" varchar(50),
	"facebook_link" varchar(50),
	"X_link" varchar(50),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "organization_info_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"project_link" varchar(55),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talent_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_url" text,
	"full_name" text NOT NULL,
	"user_id" uuid NOT NULL,
	"country" "country" NOT NULL,
	"personal_website" varchar(255),
	"about" text,
	"nationality" "nationality" NOT NULL,
	"dob" date NOT NULL,
	"gender" "gender" NOT NULL,
	"experience" "experience" NOT NULL,
	"social_link" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "talent_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text,
	"user_name" varchar(50),
	"email" varchar(50) NOT NULL,
	"country" "country" NOT NULL,
	"password" text NOT NULL,
	"company_name" varchar(100),
	"address" text,
	"phone_number" varchar(15),
	"verified_license" text,
	"agree_terms_service" boolean DEFAULT false NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "phone_number_length_check" CHECK (LENGTH("users"."phone_number") BETWEEN 10 AND 15 
          AND "users"."phone_number" ~ '^[+]?[0-9]+$')
);
--> statement-breakpoint
CREATE TABLE "work_experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"job_title" varchar(50) NOT NULL,
	"company" varchar(55) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_posting" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_title" varchar(50),
	"job_role" "job_role" NOT NULL,
	"job_type" "job_type" NOT NULL,
	"job_level" "job_level" NOT NULL,
	"salary_type" "salary_type" NOT NULL,
	"vacancies" "vacancies" NOT NULL,
	"description" text NOT NULL,
	"responsibilities" text NOT NULL,
	"min_salary" double precision DEFAULT 0,
	"max_salary" double precision DEFAULT 0 NOT NULL,
	"expiry_date" timestamp NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "job_posting_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "applied_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_profile_id" uuid NOT NULL,
	"application_status" "application_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"token_type" "token_type" NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cv" ADD CONSTRAINT "cv_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_cv_id_cv_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employer_profile" ADD CONSTRAINT "employer_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_jobs" ADD CONSTRAINT "favorite_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_jobs" ADD CONSTRAINT "favorite_jobs_job_profile_id_job_posting_id_fk" FOREIGN KEY ("job_profile_id") REFERENCES "public"."job_posting"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_info" ADD CONSTRAINT "organization_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_cv_id_cv_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_profile" ADD CONSTRAINT "talent_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_cv_id_cv_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_posting" ADD CONSTRAINT "job_posting_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applied_jobs" ADD CONSTRAINT "applied_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applied_jobs" ADD CONSTRAINT "applied_jobs_job_profile_id_job_posting_id_fk" FOREIGN KEY ("job_profile_id") REFERENCES "public"."job_posting"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;