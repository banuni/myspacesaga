import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
} from "~/server/api/trpc";
import { db } from "~/db";
import { transactions, users } from "~/db/schema";
import { eq, sql } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs";
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from "@trpc/server";


export const userRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const q = await db.select().from(users).where(eq(users.userId, userId)).limit(1);
    if (q.length) {
      return { user: q[0], isNew: false }
    }

    const q2 = await db.select().from(users).where(eq(users.userId, userId)).limit(1)

    return {
      user: q2[0], isNew: true
    }
  }),
  update: privateProcedure.mutation(({ ctx }) => {
    // await db.update(users).set({ name: "teruf 22" }).where(eq(users.userId, ctx.userId));
    return {}
  }),
  transferTo: privateProcedure.input(z.object({
    target: z.string().min(1, 'target wallet required'),
    amount: z.number().min(1, 'must transfer a positive, whole number'),
  })).mutation(async ({ input: { amount, target }, ctx: { userId } }) => {
    await db.transaction(async (tx) => {
      const targetValidQ = await tx.select({ count: sql<string>`count(*)` }).from(users).where(eq(users.walletId, target))
      const targetValid = targetValidQ[0]?.count === '1'
      if (!targetValid) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No such wallet' })
      }
      const haveFunds = await tx.select({ haveFunds: sql<boolean>`${users.balance} >= ${amount} ` }).from(users).where(eq(users.userId, userId))
      if (!haveFunds[0]?.haveFunds) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Not enough funds' })
      }
      await tx.update(users).set({ 'balance': sql`${users.balance} - ${amount}` }).where(eq(users.userId, userId))
      await tx.update(users).set({ 'balance': sql`${users.balance} + ${amount}` }).where(eq(users.walletId, target))
      await tx.insert(transactions).values({ from: userId, to: target, amount, isLoad: false, trxId: createId() })
    })
  }),
  create: privateProcedure.input(z.object({
    name: z.string().min(1, 'Need a name...'),
    faction: z.string().min(1, 'Need a faction...'),
    origin: z.string().min(1, 'Need an origin...'),
  })).mutation(async ({ input, ctx }) => {
    const userData = await clerkClient.users.getUser(ctx.userId)
    const email = userData.emailAddresses[0]?.emailAddress
    const wal = await getWalletId()
    const res = await db.insert(users).values({
      walletId: wal,
      userId: ctx.userId,
      email: email,
      name: input.name,
      faction: input.faction,
      origin: input.origin,
      balance: 0,
    })
    return {}
  }),
});

async function getWalletId() {
  let tries = 10;
  while (tries > 0) {
    const code = `${faker.hacker.ingverb()}-${faker.color.human()}-${faker.animal.type()}`.toLowerCase()
    const res = await db.select().from(users).where(eq(users.walletId, code))
    if (res.length === 0) {
      return code;
    }
    tries = tries - 1;
  }
  throw "Couldn't randomize...."
}
