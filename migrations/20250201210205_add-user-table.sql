CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
