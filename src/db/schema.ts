import {
  integer,
  pgTable,
  serial,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull(),
  walletId: varchar("walletId", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }),
  faction: varchar("faction", { length: 256 }),
  origin: varchar("origin", { length: 256 }),
  rank: varchar("rank", { length: 256 }),
  balance: integer("balance").default(0),
  profileImageUrl: varchar("profileImageUrl", { length: 256 }),
});

export const transactions = pgTable("trx", {
  id: serial("id").primaryKey(),
  trxId: varchar("trxId", { length: 256 }).notNull(),
  amount: integer("amount").notNull(),
  from: varchar("from", { length: 256 }), // from user
  to: varchar("to", { length: 256 }), // to user
  item: varchar("item", { length: 256 }),
  isLoad: boolean("isLoad").default(false),
});
