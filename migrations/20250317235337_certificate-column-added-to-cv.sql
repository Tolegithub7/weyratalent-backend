ALTER TABLE "cv" ADD COLUMN "certificate_url" text;--> statement-breakpoint
ALTER TABLE "cv" ADD CONSTRAINT "cv_certificate_url_unique" UNIQUE("certificate_url");