CREATE TYPE "public"."contact_topic" AS ENUM('booking', 'session', 'lessons', 'press', 'other');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('new', 'read', 'archived');--> statement-breakpoint
CREATE TABLE "contact_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic" "contact_topic" NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"event_date" text,
	"event_location" text,
	"locale" text NOT NULL,
	"ip_hash" text NOT NULL,
	"status" "message_status" DEFAULT 'new' NOT NULL,
	"email_sent_at" timestamp with time zone,
	"email_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_message_status_idx" ON "contact_message" USING btree ("status","created_at");