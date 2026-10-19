CREATE TYPE "public"."event_status" AS ENUM('scheduled', 'cancelled', 'postponed');--> statement-breakpoint
CREATE TABLE "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"timezone" text DEFAULT 'Europe/Zurich' NOT NULL,
	"venue_name" text NOT NULL,
	"street" text,
	"postal_code" text,
	"city" text NOT NULL,
	"country" text DEFAULT 'CH' NOT NULL,
	"venue_url" text,
	"ticket_url" text,
	"lineup" text,
	"description" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "event_status" DEFAULT 'scheduled' NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"reset_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "event_public_idx" ON "event" USING btree ("published","starts_at");