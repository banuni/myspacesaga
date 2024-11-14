import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { withDb } from "~/db";
import { transactions, users } from "~/db/schema";
import { eq, sql, ilike, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { clerkClient } from "@clerk/nextjs";
import { type User } from "@clerk/backend";

function getPlayerFullName(dbUserId: string, clerkUsers: User[]) {
  const clerkUser = clerkUsers.find((u) => u.id === dbUserId);
  if (!clerkUser) {
    return "37707";
  }
  if (!clerkUser.firstName && !clerkUser.lastName) {
    return "Anonymous User";
  }
  if (!clerkUser.firstName) {
    return clerkUser.lastName;
  }
  if (!clerkUser.lastName) {
    return clerkUser.firstName;
  }

  return `${clerkUser.firstName} ${clerkUser.lastName}`;
}

export const adminRouter = createTRPCRouter({
  users: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    // make sure userId is admin
    const [dbUsers, clerkUsers] = await Promise.all([
      withDb((db) => db.select().from(users).orderBy(users.name)),
      clerkClient.users.getUserList({ limit: 300 }),
    ]);
    const withNames = dbUsers.map((u) => ({
      ...u,
      playerName: getPlayerFullName(u.userId, clerkUsers),
    }));
    return withNames;
  }),

  deleteUser: privateProcedure
    .input(
      z.object({
        internalId: z.string().uuid(),
      })
    )
    .mutation(async ({ input: { internalId } }) => {
      //make sure ctx.userId is an admin
      await withDb((db) => db.delete(users).where(eq(users.id, internalId)));
    }),
  setOrderDone: privateProcedure
    .input(z.object({ trxId: z.string() }))
    .mutation(async ({ input: { trxId } }) => {
      // make sure ctx.userId is admin
      console.log("setOrderDone", trxId);
      await withDb((db) =>
        db
          .update(transactions)
          .set({ doneAt: sql`now()` })
          .where(eq(transactions.trxId, trxId))
      );
    }),
  balconyTrx: privateProcedure.query(async () => {
    // need to make sure admin
    const trx = await withDb((db) =>
      db
        .select({
          trxId: transactions.trxId,
          fromChar: users.name,
          fromUserId: users.userId,
          wallet: transactions.from,
          amount: transactions.amount,
          timex: transactions.createdAt,
          item: transactions.item,
          doneAt: transactions.doneAt,
        })
        .from(transactions)
        .leftJoin(users, eq(transactions.from, users.walletId))
        .where(ilike(transactions.to, "balcony"))
        .orderBy(desc(transactions.createdAt))
    );
    const clerkUsers = await clerkClient.users.getUserList({ limit: 300 });
    const withNames = trx.map((t) => ({
      ...t,
      fromPlayerName: getPlayerFullName(t.fromUserId || "", clerkUsers),
    }));
    return withNames;
  }),
  topUps: privateProcedure.query(async () => {
    // need to make sure admin
    const trxPromise = withDb((db) =>
      db
        .select({
          id: transactions.id,
          toChar: users.name,
          toUserId: users.userId,
          amount: transactions.amount,
          timex: transactions.createdAt,
        })
        .from(transactions)
        .leftJoin(users, eq(transactions.to, users.walletId))
        .where(ilike(transactions.from, "system"))
        .orderBy(desc(transactions.createdAt))
    );
    const clerkUsersPromise = await clerkClient.users.getUserList({
      limit: 300,
    });
    const [trx, clerkUsers] = await Promise.all([
      trxPromise,
      clerkUsersPromise,
    ]);
    const withNames = trx.map((t) => ({
      ...t,
      toPlayerName: getPlayerFullName(t.toUserId || "", clerkUsers),
    }));
    return withNames;
  }),
  addFunds: privateProcedure
    .input(
      z.object({
        amount: z.number().min(0),
        userId: z.string(),
      })
    )
    .mutation(async ({ input: { amount, userId }, ctx }) => {
      await withDb((db) =>
        db.transaction(async (tx) => {
          const requestingUserId = ctx.userId;
          // make sure userId is admin
          const walletId = (
            await db.select().from(users).where(eq(users.userId, userId))
          )[0]?.walletId;
          await tx
            .update(users)
            .set({ balance: sql`${users.balance} + ${amount}` })
            .where(eq(users.userId, userId));
          await tx.insert(transactions).values({
            from: "system",
            to: walletId,
            amount,
            isLoad: true,
            trxId: createId(),
          });
        })
      );
    }),
  total: privateProcedure.query(async () => {
    const zz = await withDb((db) =>
      db
        .select({ sum: sql<number>`sum(${transactions.amount})` })
        .from(transactions)
        .where(ilike(transactions.to, "balcony"))
    );
    return zz[0]?.sum;
  }),
  removeFunds: privateProcedure
    .input(
      z.object({
        amount: z.number().min(0),
        userId: z.string(),
      })
    )
    .mutation(async ({ input: { amount, userId }, ctx }) => {
      await withDb((db) =>
        db.transaction(async (tx) => {
          const requestingUserId = ctx.userId;
          // make sure userId is admin
          const walletId = (
            await db.select().from(users).where(eq(users.userId, userId))
          )[0]?.walletId;

          await tx
            .update(users)
            .set({ balance: sql`${users.balance} - ${amount}` })
            .where(eq(users.userId, userId));
          await tx.insert(transactions).values({
            to: "system",
            from: walletId,
            amount: -amount,
            isLoad: true,
            trxId: createId(),
          });
        })
      );
    }),
});
