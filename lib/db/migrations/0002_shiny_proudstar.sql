ALTER TABLE "teams" ADD COLUMN "home_pitch_id" uuid;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "training_pitch_id" uuid;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_home_pitch_id_turfs_id_fk" FOREIGN KEY ("home_pitch_id") REFERENCES "public"."turfs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_training_pitch_id_turfs_id_fk" FOREIGN KEY ("training_pitch_id") REFERENCES "public"."turfs"("id") ON DELETE set null ON UPDATE no action;