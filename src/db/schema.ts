import { int, mysqlTable, serial, varchar, boolean } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('user', {
  id: serial('id').primaryKey(),
  userId: varchar('userId', { length: 256 }),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }),
  faction: varchar('faction', { length: 256 }),
  origin: varchar('origin', { length: 256 }),
  rank: varchar('rank', { length: 256 }),
  balance: int('balance').default(0)
});

export const transactions = mysqlTable('trx', {
  id: serial('id').primaryKey(),
  trxId: varchar('trxId', { length: 256 }),
  amount: int('amount').notNull(),
  from: varchar('from', { length: 256 }), // from user
  to: varchar('to', { length: 256 }), // to user
  item: varchar('item', { length: 256 }),
  isLoad: boolean('isLoad').default(false),
})
