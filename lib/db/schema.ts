// import { relations } from "drizzle-orm"
import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const userRoles = ["admin", "user"] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum("user_roles", userRoles)

export const user = pgTable("users", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  password: varchar("password", { length: 64 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  role: userRoleEnum().notNull().default("user"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const verificationToken = pgTable(
  "VerificationToken",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: varchar("email", { length: 64 }).notNull(),
    token: varchar("token", { length: 64 }).notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("emailTokenUnique").on(
      table.email,
      table.token
    ),
  })
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