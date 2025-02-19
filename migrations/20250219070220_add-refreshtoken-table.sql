CREATE TYPE "public"."token_type" AS ENUM('access', 'refresh');--> statement-breakpoint
CREATE TABLE "token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"token_type" "token_type" NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "token_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;