import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const isDev = process.env.NODE_ENV === "development";

function buildPoolConfig() {
  const connStr = process.env.DATABASE_URL || "";

  try {
    const url = new URL(connStr);
    return {
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      host: url.hostname,
      port: url.port ? parseInt(url.port, 10) : 5432,
      database: url.pathname.replace(/^\//, ""),
      ssl: isDev ? false : { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  } catch {
    return {
      connectionString: connStr,
      ssl: isDev ? false : { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  }
}

const pool = new pg.Pool(buildPoolConfig());

export const db = drizzle(pool, { schema });
