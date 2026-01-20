ALTER TABLE "users" ALTER COLUMN "openId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "supabaseId" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_supabaseId_unique" UNIQUE("supabaseId");