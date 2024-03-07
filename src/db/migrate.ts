import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";

const connectionString = process.env.NEON_CONNECTION_STRING!;
const doMigrate = async (): Promise<void> => {
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: "drizzle" });
  await sql.end();
  return;
};

doMigrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
