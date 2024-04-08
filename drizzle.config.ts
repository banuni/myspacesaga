import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEON_CONNECTION_STRING || "",
  },
  out: "./drizzle",
} satisfies Config;
