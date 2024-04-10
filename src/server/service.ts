import { TRPCError } from "@trpc/server";
import { type ExtractTablesWithRelations, eq, sql } from "drizzle-orm";
import { type PgTransaction } from "drizzle-orm/pg-core";
import { type PostgresJsDatabase, type PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { users } from "~/db/schema";

type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export const getUserWallet = async (userId: string, tx: PostgresJsDatabase<Record<string, never>>) => {
  const srcWallet = (
    await tx
      .select({ wallatId: users.walletId })
      .from(users)
      .where(eq(users.userId, userId))
  )[0]?.wallatId;
  if (!srcWallet) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
  }
  return srcWallet;
};

export const doesUserHaveFunds = async (
  userId: string,
  amount: number,
  tx: Transaction
) => {
  const haveFunds = await tx
    .select({
      haveFunds: sql<string>`${users.balance} >= ${amount} `,
      balance: users.balance,
    })
    .from(users)
    .where(eq(users.userId, userId));
  return haveFunds[0]?.haveFunds;
};
