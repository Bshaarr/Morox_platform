import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../shared/schema";

declare global {
	// eslint-disable-next-line no-var
	var __pgPool__: Pool | undefined;
	// eslint-disable-next-line no-var
	var __drizzleDb__: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

export function getPool(): Pool | undefined {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) return undefined;
	if (!global.__pgPool__) {
		global.__pgPool__ = new Pool({ connectionString });
	}
	return global.__pgPool__;
}

export function getDb() {
	const pool = getPool();
	if (!pool) return undefined;
	if (!global.__drizzleDb__) {
		global.__drizzleDb__ = drizzle(pool, { schema });
	}
	return global.__drizzleDb__;
}