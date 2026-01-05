import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

const dbUrl = new URL(connectionString);

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
port: Number(dbUrl.port) || 3306,
    database: dbUrl.pathname.slice(1),
  } as any,
});