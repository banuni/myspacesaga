import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "~/env.mjs";

const sql = postgres(env.NEON_CONNECTION_STRING);

export const db = drizzle(sql);

type DbType = ReturnType<typeof drizzle>;

export async function withDb<R>(fn: (db: DbType) => Promise<R>) {
  const pg = postgres(env.NEON_CONNECTION_STRING);
  try {
    return fn(db);
  } finally {
    await pg.end();
  }
}
