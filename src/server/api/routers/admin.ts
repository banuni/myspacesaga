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
    const res = await db.select().from(users).limit(30);
    return res;
  }),
  deleteUser: privateProcedure.input(z.object({
    internalId: z.number().int()
  })).mutation(async ({ input: { internalId } }) => {
    //make sure ctx.userId is an admin
    await db.delete(users).where(eq(users.id, internalId))
  }),
  addFunds: privateProcedure.input(z.object({
    amount: z.number().min(0),
    userId: z.string(),
  })).mutation(async ({ input: { amount, userId }, ctx }) => {
    await db.transaction(async (tx) => {
      const requestingUserId = ctx.userId;
      // make sure userId is admin

      await tx.update(users).set({ balance: sql`${users.balance} + ${amount}` }).where(eq(users.userId, userId));
      await tx.insert(transactions).values({ to: userId, amount, isLoad: true, trxId: createId() });
    })
  }),
  removeFunds: privateProcedure.input(z.object({
    amount: z.number().min(0),
    userId: z.string(),
  })).mutation(async ({ input: { amount, userId }, ctx }) => {
    await db.transaction(async (tx) => {
      const requestingUserId = ctx.userId;
      // make sure userId is admin

      await tx.update(users).set({ balance: sql`${users.balance} - ${amount}` }).where(eq(users.userId, userId));
      await tx.insert(transactions).values({ to: userId, amount: -amount, isLoad: true, trxId: createId() });
    })
  })
});
