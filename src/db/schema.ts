import { boolean, index, integer, jsonb, pgTable, primaryKey, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { Topic } from "@/lib/topics";
import type { BreakdownItem, SourceLanguage } from "@/lib/translation/types";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const entry = pgTable(
  "entry",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    sourceText: text("source_text").notNull(),
    sourceLanguage: text("source_language").$type<SourceLanguage>().notNull(),
    spanish: text("spanish").notNull(),
    breakdown: jsonb("breakdown").$type<readonly BreakdownItem[]>().notNull(),
    note: text("note"),
    starred: boolean("starred").notNull().default(false),
    topic: text("topic").$type<Topic>(),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull().defaultNow(),
    ease: real("ease").notNull().default(2.5),
    intervalDays: integer("interval_days").notNull().default(0),
    repetitions: integer("repetitions").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("entry_user_created_idx").on(table.userId, table.createdAt),
    index("entry_user_due_idx").on(table.userId, table.dueAt),
  ],
);

export const starterReview = pgTable(
  "starter_review",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cardId: text("card_id").notNull(),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull().defaultNow(),
    ease: real("ease").notNull().default(2.5),
    intervalDays: integer("interval_days").notNull().default(0),
    repetitions: integer("repetitions").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.userId, table.cardId] })],
);

export type Entry = typeof entry.$inferSelect;

export const aiCall = pgTable(
  "ai_call",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("ai_call_user_created_idx").on(table.userId, table.createdAt)],
);
