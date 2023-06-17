import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
} from "~/server/api/trpc";
import { db } from "~/db";
import { transactions, users } from "~/db/schema";
import { eq, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const adminRouter = createTRPCRouter({
  users: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    // make sure userId is admin
    const res = await db.select().from(users);
    return res;
  }),

  deleteUser: privateProcedure.input(z.object({
    internalId: z.number().int()
  })).mutation(async ({ input: { internalId } }) => {
    //make sure ctx.userId is an admin
    await db.delete(users).where(eq(users.id, internalId))
  }),
  balconyTrx: privateProcedure.query(async () => {
    // need to make sure admin
    const trx = await db.select(
      {
        from: users.name,
        wallet: transactions.from,
        amount: transactions.amount
      }).from(transactions).leftJoin(users, eq(transactions.from, users.walletId))
      .where(eq(transactions.to, 'BALCONY'))
    return trx
  }),
  addFunds: privateProcedure.input(z.object({
    amount: z.number().min(0),
    userId: z.string(),
  })).mutation(async ({ input: { amount, userId }, ctx }) => {
    await db.transaction(async (tx) => {
      const requestingUserId = ctx.userId;
      // make sure userId is admin
      const walletId = (await db.select().from(users).where(eq(users.userId, userId)))[0]?.walletId
      await tx.update(users).set({ balance: sql`${users.balance} + ${amount}` }).where(eq(users.userId, userId));
      await tx.insert(transactions).values({ from: 'system', to: walletId, amount, isLoad: true, trxId: createId() });
    })
  }),
  total: privateProcedure.query(async () => {
    const zz = await db.select({ sum: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .where(eq(transactions.to, 'BALCONY'))
    return zz[0]?.sum
  }),
  removeFunds: privateProcedure.input(z.object({
    amount: z.number().min(0),
    userId: z.string(),
  })).mutation(async ({ input: { amount, userId }, ctx }) => {
    await db.transaction(async (tx) => {
      const requestingUserId = ctx.userId;
      // make sure userId is admin
      const walletId = (await db.select().from(users).where(eq(users.userId, userId)))[0]?.walletId

      await tx.update(users).set({ balance: sql`${users.balance} - ${amount}` }).where(eq(users.userId, userId));
      await tx.insert(transactions).values({ to: 'system', from: walletId, amount: -amount, isLoad: true, trxId: createId(), });
    })
  })
});
