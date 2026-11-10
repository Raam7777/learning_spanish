CREATE TABLE "starter_review" (
	"user_id" text NOT NULL,
	"card_id" text NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ease" real DEFAULT 2.5 NOT NULL,
	"interval_days" integer DEFAULT 0 NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "starter_review_user_id_card_id_pk" PRIMARY KEY("user_id","card_id")
);
--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "topic" text;--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "due_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "ease" real DEFAULT 2.5 NOT NULL;--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "interval_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "repetitions" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "starter_review" ADD CONSTRAINT "starter_review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entry_user_due_idx" ON "entry" USING btree ("user_id","due_at");--> statement-breakpoint
UPDATE "user" SET "email_verified" = true WHERE "email_verified" = false;