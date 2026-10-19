CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"storage_key" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"alt" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"credit" text,
	"published" boolean DEFAULT false NOT NULL,
	"portrait" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "media_gallery_idx" ON "media" USING btree ("published","sort_order");