// import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoles = ["player", "agent"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_roles", userRoles);

export const positions = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
] as const;
export type Position = (typeof positions)[number];
export const positionEnum = pgEnum("player_positions", positions);

export const user = pgTable("users", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  password: varchar("password", { length: 64 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  position: positionEnum("position").notNull(),
  avatarUrl: varchar("avatarUrl", { length: 256 }),
  role: userRoleEnum().notNull().default("player"),
  stats: jsonb("stats").$type<{
    matchesPlayed: number;
    goals: number;
    assists: number;
    motm: number;
    rating: number;
  }>(),
  attributes: jsonb("attributes").$type<{
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defense: number;
    physical: number;
    stamina: number;
    workRate: number;
  }>(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const match = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  location: varchar("location").notNull(),
  mode: varchar("mode").notNull(),
  price: numeric("price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  homeTeam: jsonb("home_team").$type<string[]>().notNull().default([]),
  awayTeam: jsonb("away_team").$type<string[]>().notNull().default([]),
  maxPlayers: integer("max_players").notNull().default(14),
  registeredPlayerIds: jsonb("registered_player_ids")
    .$type<string[]>()
    .notNull()
    .default([]),
  completed: boolean("completed").notNull().default(false),
  score: jsonb("score").$type<{
    home: number;
    away: number;
  }>(),
  matchReport: varchar("match_report"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const matchPlayers = pgTable(
  "match_players",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    matchId: uuid("match_id")
      .references(() => match.id, { onDelete: "cascade" })
      .notNull(),
    playerId: uuid("player_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    position: positionEnum("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniquePlayerPerMatch: uniqueIndex("unique_match_player").on(
      table.matchId,
      table.playerId,
    ),
  }),
);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => user.id)
    .notNull(),
  matchId: uuid("match_id")
    .references(() => match.id)
    .notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  checkoutRequestId: varchar("checkout_request_id").unique(),
  status: varchar("status", { length: 16 })
    .$type<"pending" | "success" | "failed">()
    .notNull()
    .default("pending"),
  emailSent: boolean("email_sent").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const verificationToken = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: varchar("email", { length: 64 }).notNull(),
    token: varchar("token", { length: 64 }).notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("emailTokenUnique").on(
      table.email,
      table.token,
    ),
  }),
);

// export const userRelations = relations(UserTable, ({ many }) => ({
//   oAuthAccounts: many(UserOAuthAccountTable),
// }))

// export const oAuthProviders = ["discord", "github"] as const
// export type OAuthProvider = (typeof oAuthProviders)[number]
// export const oAuthProviderEnum = pgEnum("oauth_provides", oAuthProviders)

// export const UserOAuthAccountTable = pgTable(
//   "user_oauth_accounts",
//   {
//     userId: uuid()
//       .notNull()
//       .references(() => UserTable.id, { onDelete: "cascade" }),
//     provider: oAuthProviderEnum().notNull(),
//     providerAccountId: text().notNull().unique(),
//     createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
//     updatedAt: timestamp({ withTimezone: true })
//       .notNull()
//       .defaultNow()
//       .$onUpdate(() => new Date()),
//   },
//   t => [primaryKey({ columns: [t.providerAccountId, t.provider] })]
// )

// export const userOauthAccountRelationships = relations(
//   UserOAuthAccountTable,
//   ({ one }) => ({
//     user: one(UserTable, {
//       fields: [UserOAuthAccountTable.userId],
//       references: [UserTable.id],
//     }),
//   })
// )
