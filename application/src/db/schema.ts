import {
  bigint,
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  telegramId: bigint("telegram_id", { mode: "bigint" }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionCategoriesTable = pgTable(
  "transaction_categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    userId: bigint("user_id", { mode: "bigint" })
      .notNull()
      .references(() => usersTable.telegramId),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    nameUserIdUnique: unique("name_user_id_unique").on(
      table.name,
      table.userId,
    ),
  }),
);

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  amount: integer("amount").notNull(),
  notes: varchar("notes", { length: 255 }),
  type: varchar({ enum: ["income", "expense"] }),
  categoryId: serial("category_id")
    .notNull()
    .references(() => transactionCategoriesTable.id),
  userId: bigint("user_id", { mode: "bigint" })
    .notNull()
    .references(() => usersTable.telegramId),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const remindersTable = pgTable("reminders", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  time: timestamp("remind_at").notNull(),
  message: varchar("description", { length: 255 }),
  userId: bigint("user_id", { mode: "bigint" })
    .notNull()
    .references(() => usersTable.telegramId),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectTransaction = typeof transactionsTable.$inferSelect;
export type InsertTransaction = typeof transactionsTable.$inferInsert;

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
