CREATE TYPE "public"."country" AS ENUM('Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cape Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe');--> statement-breakpoint
CREATE TYPE "public"."nationality" AS ENUM('Algerian', 'Angolan', 'Beninese', 'Motswana', 'Burkinabe', 'Burundian', 'Cameroonian', 'Cape Verdean', 'Central African', 'Chadian', 'Comorian', 'Congolese (Congo)', 'Congolese (DRC)', 'Djiboutian', 'Egyptian', 'Equatorial Guinean', 'Eritrean', 'Swazi', 'Ethiopian', 'Gabonese', 'Gambian', 'Ghanaian', 'Guinean', 'Bissau-Guinean', 'Ivorian', 'Kenyan', 'Mosotho', 'Liberian', 'Libyan', 'Malagasy', 'Malawian', 'Malian', 'Mauritanian', 'Mauritian', 'Moroccan', 'Mozambican', 'Namibian', 'Nigerien', 'Nigerian', 'Rwandan', 'Santomean', 'Senegalese', 'Seychellois', 'Sierra Leonean', 'Somali', 'South African', 'South Sudanese', 'Sudanese', 'Tanzanian', 'Togolese', 'Tunisian', 'Ugandan', 'Zambian', 'Zimbabwean');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "first_name" TO "full_name";--> statement-breakpoint
ALTER TABLE "talent_profile" ALTER COLUMN "nationality" SET DATA TYPE nationality;--> statement-breakpoint
ALTER TABLE "talent_profile" ALTER COLUMN "social_link" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "talent_profile" ADD COLUMN "country" "country" NOT NULL;--> statement-breakpoint
ALTER TABLE "talent_profile" ADD COLUMN "personal_website" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_name" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" "country" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verified_license" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "agree_terms_service" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "applied_jobs" ADD COLUMN "cover_letter" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");