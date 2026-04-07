-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────

CREATE TYPE user_roles AS ENUM ('player', 'agent');
CREATE TYPE player_positions AS ENUM ('Goalkeeper', 'Defender', 'Midfielder', 'Forward');
CREATE TYPE tournament_status AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');
CREATE TYPE tournament_format AS ENUM ('LEAGUE', 'KNOCKOUT', 'GROUP_STAGE_KNOCKOUT', 'ROUND_ROBIN');
CREATE TYPE fixture_status AS ENUM ('UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED', 'POSTPONED');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE turf_surface AS ENUM ('natural_grass', 'artificial_turf', 'futsal_floor', 'indoor');
CREATE TYPE system_user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE notification_type AS ENUM (
  'MATCH_REMINDER',
  'PAYMENT_CONFIRMED',
  'TOURNAMENT_UPDATE',
  'TEAM_INVITE',
  'GENERAL'
);

-- ─────────────────────────────────────────────
-- ROLES & PERMISSIONS
-- ─────────────────────────────────────────────

CREATE TABLE system_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(64)  NOT NULL UNIQUE,
  description VARCHAR(256),
  is_default  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         VARCHAR(128) NOT NULL UNIQUE,
  "group"     VARCHAR(64),
  description VARCHAR(256),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id       UUID        NOT NULL REFERENCES system_roles(id) ON DELETE CASCADE,
  permission_id UUID        NOT NULL REFERENCES permissions(id)  ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);

-- ─────────────────────────────────────────────
-- SYSTEM USERS (admin panel operators)
-- ─────────────────────────────────────────────

CREATE TABLE system_users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(64)        NOT NULL,
  email          VARCHAR(64)        NOT NULL UNIQUE,
  email_verified TIMESTAMPTZ,
  password       VARCHAR(256)       NOT NULL,
  phone          VARCHAR(15),
  avatar_url     VARCHAR(512),
  status         system_user_status NOT NULL DEFAULT 'active',
  role_id        UUID               REFERENCES system_roles(id) ON DELETE SET NULL,
  last_login_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- MEDIA (defined before tables that reference it)
-- ─────────────────────────────────────────────

CREATE TABLE media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id UUID         REFERENCES users(id) ON DELETE SET NULL,
  type        media_type   NOT NULL,
  url         VARCHAR(1024) NOT NULL,
  caption     VARCHAR(256),
  mime_type   VARCHAR(64),
  size_bytes  INTEGER,
  entity_type VARCHAR(64),
  entity_id   UUID,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX media_entity_idx   ON media (entity_type, entity_id);
CREATE INDEX media_uploader_idx ON media (uploader_id);

-- ─────────────────────────────────────────────
-- PLAYERS / AGENTS (end users)
-- ─────────────────────────────────────────────

CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(64)      NOT NULL,
  email          VARCHAR(64)      NOT NULL UNIQUE,
  email_verified TIMESTAMPTZ,
  password       VARCHAR(256)     NOT NULL,
  phone          VARCHAR(15),
  position       player_positions NOT NULL,
  avatar_url     VARCHAR(512),
  role           user_roles       NOT NULL DEFAULT 'player',
  bio            TEXT,
  is_active      BOOLEAN          NOT NULL DEFAULT TRUE,
  stats          JSONB,
  attributes     JSONB,
  ai_analysis    TEXT,
  last_login_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TURFS
-- ─────────────────────────────────────────────

CREATE TABLE turfs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(128)  NOT NULL,
  area          VARCHAR(128),
  city          VARCHAR(64)   NOT NULL,
  address       TEXT,
  latitude      NUMERIC(10, 7),
  longitude     NUMERIC(10, 7),
  surface       turf_surface,
  amenities     JSONB         DEFAULT '[]',
  price_per_hour NUMERIC(10, 2),
  rating        NUMERIC(3, 2) DEFAULT 0.00,
  total_reviews INTEGER       NOT NULL DEFAULT 0,
  capacity      INTEGER,
  agent_id      UUID          REFERENCES users(id) ON DELETE SET NULL,
  is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  images        JSONB         DEFAULT '[]',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TEAMS
-- ─────────────────────────────────────────────

CREATE TABLE teams (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(128) NOT NULL,
  badge_url      VARCHAR(512),
  badge_fallback VARCHAR(8),
  type           VARCHAR(64),
  bio            TEXT,
  captain_id     UUID         REFERENCES users(id) ON DELETE SET NULL,
  stats          JSONB,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE team_members (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id        UUID             NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
  player_id      UUID             NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  position       player_positions,
  jersey_number  SMALLINT,
  joined_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  is_active      BOOLEAN          NOT NULL DEFAULT TRUE,
  CONSTRAINT unique_team_member UNIQUE (team_id, player_id)
);

CREATE INDEX team_member_team_idx   ON team_members (team_id);
CREATE INDEX team_member_player_idx ON team_members (player_id);

-- ─────────────────────────────────────────────
-- TOURNAMENTS
-- ─────────────────────────────────────────────

CREATE TABLE tournaments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(128)       NOT NULL,
  description           TEXT,
  location              VARCHAR(256),
  turf_id               UUID               REFERENCES turfs(id)        ON DELETE SET NULL,
  prize_pool            NUMERIC(12, 2)     DEFAULT 0.00,
  entry_fee             NUMERIC(10, 2)     DEFAULT 0.00,
  max_teams             INTEGER,
  max_players_per_team  INTEGER,
  format                tournament_format  NOT NULL DEFAULT 'KNOCKOUT',
  status                tournament_status  NOT NULL DEFAULT 'UPCOMING',
  starts_at             TIMESTAMPTZ,
  ends_at               TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  rules                 TEXT,
  banner_id             UUID               REFERENCES media(id)        ON DELETE SET NULL,
  organized_by          UUID               REFERENCES system_users(id) ON DELETE SET NULL,
  is_public             BOOLEAN            NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE TABLE tournament_teams (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID           NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id       UUID           NOT NULL REFERENCES teams(id)       ON DELETE CASCADE,
  registered_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  payment_status payment_status NOT NULL DEFAULT 'pending',
  is_eliminated BOOLEAN        NOT NULL DEFAULT FALSE,
  group_name    VARCHAR(8),
  CONSTRAINT unique_tournament_team UNIQUE (tournament_id, team_id)
);

CREATE INDEX tournament_team_tournament_idx ON tournament_teams (tournament_id);

CREATE TABLE tournament_participants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id  UUID           NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id      UUID           NOT NULL REFERENCES users(id)       ON DELETE CASCADE,
  registered_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  payment_status payment_status NOT NULL DEFAULT 'pending',
  CONSTRAINT unique_tournament_participant UNIQUE (tournament_id, player_id)
);

CREATE TABLE standings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   UUID        NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id         UUID                 REFERENCES teams(id)       ON DELETE CASCADE,
  player_id       UUID                 REFERENCES users(id)       ON DELETE CASCADE,
  group_name      VARCHAR(8),
  rank            INTEGER     NOT NULL DEFAULT 0,
  matches_played  INTEGER     NOT NULL DEFAULT 0,
  wins            INTEGER     NOT NULL DEFAULT 0,
  draws           INTEGER     NOT NULL DEFAULT 0,
  losses          INTEGER     NOT NULL DEFAULT 0,
  goals_for       INTEGER     NOT NULL DEFAULT 0,
  goals_against   INTEGER     NOT NULL DEFAULT 0,
  goal_difference INTEGER     NOT NULL DEFAULT 0,
  points          INTEGER     NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX standing_tournament_idx      ON standings (tournament_id);
CREATE INDEX standing_tournament_team_idx ON standings (tournament_id, team_id);

-- ─────────────────────────────────────────────
-- MATCHES / FIXTURES
-- ─────────────────────────────────────────────

CREATE TABLE matches (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date                 TIMESTAMPTZ    NOT NULL,
  location             VARCHAR(256)   NOT NULL,
  turf_id              UUID           REFERENCES turfs(id)       ON DELETE SET NULL,
  tournament_id        UUID           REFERENCES tournaments(id) ON DELETE SET NULL,
  home_team_id         UUID           REFERENCES teams(id)       ON DELETE SET NULL,
  away_team_id         UUID           REFERENCES teams(id)       ON DELETE SET NULL,
  home_team            JSONB          NOT NULL DEFAULT '[]',
  away_team            JSONB          NOT NULL DEFAULT '[]',
  mode                 VARCHAR(32)    NOT NULL,
  price                NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  max_players          INTEGER        NOT NULL DEFAULT 14,
  registered_player_ids JSONB         NOT NULL DEFAULT '[]',
  status               fixture_status NOT NULL DEFAULT 'UPCOMING',
  completed            BOOLEAN        NOT NULL DEFAULT FALSE,
  score                JSONB,
  match_report         TEXT,
  is_public            BOOLEAN        NOT NULL DEFAULT TRUE,
  round_name           VARCHAR(64),
  created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX match_tournament_idx ON matches (tournament_id);
CREATE INDEX match_date_idx       ON matches (date);
CREATE INDEX match_status_idx     ON matches (status);

CREATE TABLE match_players (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id     UUID             NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id    UUID             NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  position     player_positions NOT NULL,
  team         VARCHAR(8)       NOT NULL DEFAULT 'home',
  goals        SMALLINT         NOT NULL DEFAULT 0,
  assists      SMALLINT         NOT NULL DEFAULT 0,
  yellow_cards SMALLINT         NOT NULL DEFAULT 0,
  red_card     BOOLEAN          NOT NULL DEFAULT FALSE,
  rating       NUMERIC(4, 2),
  motm         BOOLEAN          NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_match_player UNIQUE (match_id, player_id)
);

CREATE INDEX match_player_match_idx  ON match_players (match_id);
CREATE INDEX match_player_player_idx ON match_players (player_id);

-- ─────────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────────

CREATE TABLE payments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID           NOT NULL REFERENCES users(id),
  match_id             UUID                    REFERENCES matches(id)      ON DELETE SET NULL,
  tournament_id        UUID                    REFERENCES tournaments(id)  ON DELETE SET NULL,
  amount               NUMERIC(10, 2) NOT NULL,
  currency             VARCHAR(8)     NOT NULL DEFAULT 'KES',
  phone                VARCHAR(15)    NOT NULL,
  checkout_request_id  VARCHAR(128)   UNIQUE,
  merchant_request_id  VARCHAR(128),
  mpesa_receipt_number VARCHAR(64),
  status               payment_status NOT NULL DEFAULT 'pending',
  failure_reason       VARCHAR(256),
  email_sent           BOOLEAN        NOT NULL DEFAULT FALSE,
  metadata             JSONB,
  created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX payment_user_idx   ON payments (user_id);
CREATE INDEX payment_match_idx  ON payments (match_id);
CREATE INDEX payment_status_idx ON payments (status);

-- ─────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        notification_type NOT NULL DEFAULT 'GENERAL',
  title       VARCHAR(128)      NOT NULL,
  body        TEXT,
  is_read     BOOLEAN           NOT NULL DEFAULT FALSE,
  entity_type VARCHAR(64),
  entity_id   UUID,
  created_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX notification_user_idx ON notifications (user_id);
CREATE INDEX notification_read_idx ON notifications (user_id, is_read);

-- ─────────────────────────────────────────────
-- SYSTEM LOGS
-- ─────────────────────────────────────────────

CREATE TABLE system_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID,
  actor_type  VARCHAR(16),
  action      VARCHAR(128) NOT NULL,
  entity_type VARCHAR(64),
  entity_id   UUID,
  description TEXT,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX system_log_actor_idx      ON system_logs (actor_id);
CREATE INDEX system_log_action_idx     ON system_logs (action);
CREATE INDEX system_log_created_at_idx ON system_logs (created_at);

-- ─────────────────────────────────────────────
-- AUTH TOKENS
-- ─────────────────────────────────────────────

CREATE TABLE verification_tokens (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email   VARCHAR(64) NOT NULL,
  token   VARCHAR(64) NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  CONSTRAINT email_token_unique UNIQUE (email, token)
);

CREATE TABLE password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(64) NOT NULL,
  token      VARCHAR(64) NOT NULL UNIQUE,
  expires    TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX password_reset_email_idx ON password_reset_tokens (email);