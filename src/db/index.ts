import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "~/env.mjs";

const sql = postgres(env.NEON_CONNECTION_STRING);

export const db = drizzle(sql);
