CREATE TYPE "public"."challenge_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."fixture_status" AS ENUM('UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED', 'POSTPONED');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('MATCH_REMINDER', 'PAYMENT_CONFIRMED', 'TOURNAMENT_UPDATE', 'TEAM_INVITE', 'GENERAL');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."player_positions" AS ENUM('Goalkeeper', 'Defender', 'Midfielder', 'Forward');--> statement-breakpoint
CREATE TYPE "public"."system_user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."tournament_format" AS ENUM('LEAGUE', 'KNOCKOUT', 'GROUP_STAGE_KNOCKOUT', 'ROUND_ROBIN');--> statement-breakpoint
CREATE TYPE "public"."tournament_status" AS ENUM('UPCOMING', 'ONGOING', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."turf_surface" AS ENUM('natural_grass', 'artificial_turf', 'futsal_floor', 'indoor');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('player', 'agent');--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenger_team_id" uuid NOT NULL,
	"challenged_team_id" uuid NOT NULL,
	"proposed_date" timestamp with time zone,
	"proposed_turf_id" uuid,
	"proposed_location" varchar(256),
	"mode" varchar(32) DEFAULT '5v5' NOT NULL,
	"message" text,
	"status" "challenge_status" DEFAULT 'PENDING' NOT NULL,
	"match_id" uuid,
	"responded_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"location" varchar(256) NOT NULL,
	"turf_id" uuid,
	"tournament_id" uuid,
	"home_team_id" uuid,
	"away_team_id" uuid,
	"home_team" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"away_team" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mode" varchar(32) NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"max_players" integer DEFAULT 14 NOT NULL,
	"registered_player_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "fixture_status" DEFAULT 'UPCOMING' NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"score" jsonb,
	"match_report" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"round_name" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"position" "player_positions" NOT NULL,
	"team" varchar(8) DEFAULT 'home' NOT NULL,
	"goals" smallint DEFAULT 0 NOT NULL,
	"assists" smallint DEFAULT 0 NOT NULL,
	"yellow_cards" smallint DEFAULT 0 NOT NULL,
	"red_card" boolean DEFAULT false NOT NULL,
	"rating" numeric(4, 2),
	"motm" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uploader_id" uuid,
	"type" "media_type" NOT NULL,
	"url" varchar(1024) NOT NULL,
	"caption" varchar(256),
	"mime_type" varchar(64),
	"size_bytes" integer,
	"entity_type" varchar(64),
	"entity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" DEFAULT 'GENERAL' NOT NULL,
	"title" varchar(128) NOT NULL,
	"body" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"entity_type" varchar(64),
	"entity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"token" varchar(64) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"match_id" uuid,
	"tournament_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(8) DEFAULT 'KES' NOT NULL,
	"phone" varchar(15) NOT NULL,
	"checkout_request_id" varchar(128),
	"merchant_request_id" varchar(128),
	"mpesa_receipt_number" varchar(64),
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"failure_reason" varchar(256),
	"email_sent" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_checkout_request_id_unique" UNIQUE("checkout_request_id")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(128) NOT NULL,
	"group" varchar(64),
	"description" varchar(256),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"team_id" uuid,
	"player_id" uuid,
	"group_name" varchar(8),
	"rank" integer DEFAULT 0 NOT NULL,
	"matches_played" integer DEFAULT 0 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"draws" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"goals_for" integer DEFAULT 0 NOT NULL,
	"goals_against" integer DEFAULT 0 NOT NULL,
	"goal_difference" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"actor_type" varchar(16),
	"action" varchar(128) NOT NULL,
	"entity_type" varchar(64),
	"entity_id" uuid,
	"description" text,
	"ip_address" varchar(45),
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" varchar(256),
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "system_roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "system_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"email" varchar(64) NOT NULL,
	"email_verified" timestamp with time zone,
	"password" varchar(256) NOT NULL,
	"phone" varchar(15),
	"avatar_url" varchar(512),
	"status" "system_user_status" DEFAULT 'active' NOT NULL,
	"role_id" uuid,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "system_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"badge_url" varchar(512),
	"badge_fallback" varchar(8),
	"type" varchar(64),
	"bio" text,
	"captain_id" uuid,
	"home_pitch_id" uuid,
	"training_pitch_id" uuid,
	"stats" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"position" "player_positions",
	"jersey_number" smallint,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"location" varchar(256),
	"turf_id" uuid,
	"prize_pool" numeric(12, 2) DEFAULT '0.00',
	"entry_fee" numeric(10, 2) DEFAULT '0.00',
	"max_teams" integer,
	"max_players_per_team" integer,
	"format" "tournament_format" DEFAULT 'KNOCKOUT' NOT NULL,
	"status" "tournament_status" DEFAULT 'UPCOMING' NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"registration_deadline" timestamp with time zone,
	"rules" text,
	"banner_id" uuid,
	"organized_by" uuid,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"is_eliminated" boolean DEFAULT false NOT NULL,
	"group_name" varchar(8)
);
--> statement-breakpoint
CREATE TABLE "turfs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"area" varchar(128),
	"city" varchar(64) NOT NULL,
	"address" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"surface" "turf_surface",
	"amenities" jsonb DEFAULT '[]'::jsonb,
	"price_per_hour" numeric(10, 2),
	"rating" numeric(3, 2) DEFAULT '0.00',
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"capacity" integer,
	"agent_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"email" varchar(64) NOT NULL,
	"email_verified" timestamp with time zone,
	"password" varchar(256) NOT NULL,
	"phone" varchar(15),
	"position" "player_positions" NOT NULL,
	"avatar_url" varchar(512),
	"role" "user_roles" DEFAULT 'player' NOT NULL,
	"bio" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"stats" jsonb,
	"attributes" jsonb,
	"ai_analysis" text,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"token" varchar(64) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_challenger_team_id_teams_id_fk" FOREIGN KEY ("challenger_team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_challenged_team_id_teams_id_fk" FOREIGN KEY ("challenged_team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_proposed_turf_id_turfs_id_fk" FOREIGN KEY ("proposed_turf_id") REFERENCES "public"."turfs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_turf_id_turfs_id_fk" FOREIGN KEY ("turf_id") REFERENCES "public"."turfs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_system_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."system_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_role_id_system_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."system_roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_captain_id_users_id_fk" FOREIGN KEY ("captain_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_home_pitch_id_turfs_id_fk" FOREIGN KEY ("home_pitch_id") REFERENCES "public"."turfs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_training_pitch_id_turfs_id_fk" FOREIGN KEY ("training_pitch_id") REFERENCES "public"."turfs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_turf_id_turfs_id_fk" FOREIGN KEY ("turf_id") REFERENCES "public"."turfs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_banner_id_media_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_organized_by_system_users_id_fk" FOREIGN KEY ("organized_by") REFERENCES "public"."system_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_participants" ADD CONSTRAINT "tournament_participants_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_participants" ADD CONSTRAINT "tournament_participants_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turfs" ADD CONSTRAINT "turfs_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_pending_challenge" ON "challenges" USING btree ("challenger_team_id","challenged_team_id");--> statement-breakpoint
CREATE INDEX "challenge_challenger_idx" ON "challenges" USING btree ("challenger_team_id");--> statement-breakpoint
CREATE INDEX "challenge_challenged_idx" ON "challenges" USING btree ("challenged_team_id");--> statement-breakpoint
CREATE INDEX "challenge_status_idx" ON "challenges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "match_tournament_idx" ON "matches" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "match_date_idx" ON "matches" USING btree ("date");--> statement-breakpoint
CREATE INDEX "match_status_idx" ON "matches" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_match_player" ON "match_players" USING btree ("match_id","player_id");--> statement-breakpoint
CREATE INDEX "match_player_match_idx" ON "match_players" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "match_player_player_idx" ON "match_players" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "media_entity_idx" ON "media" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "media_uploader_idx" ON "media" USING btree ("uploader_id");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "password_reset_email_idx" ON "password_reset_tokens" USING btree ("email");--> statement-breakpoint
CREATE INDEX "payment_user_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_match_idx" ON "payments" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_role_permission" ON "role_permissions" USING btree ("role_id","permission_id");--> statement-breakpoint
CREATE INDEX "standing_tournament_idx" ON "standings" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "standing_tournament_team_idx" ON "standings" USING btree ("tournament_id","team_id");--> statement-breakpoint
CREATE INDEX "system_log_actor_idx" ON "system_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "system_log_action_idx" ON "system_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "system_log_created_at_idx" ON "system_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_team_member" ON "team_members" USING btree ("team_id","player_id");--> statement-breakpoint
CREATE INDEX "team_member_team_idx" ON "team_members" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_member_player_idx" ON "team_members" USING btree ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_tournament_participant" ON "tournament_participants" USING btree ("tournament_id","player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_tournament_team" ON "tournament_teams" USING btree ("tournament_id","team_id");--> statement-breakpoint
CREATE INDEX "tournament_team_tournament_idx" ON "tournament_teams" USING btree ("tournament_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_token_unique" ON "verification_tokens" USING btree ("email","token");