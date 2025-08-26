import { getDb, getPool } from "./db";

let ensured = false;

export async function ensureDatabaseSetup(): Promise<void> {
	if (ensured) return;
	const pool = getPool();
	if (!pool) return;
	const client = await pool.connect();
	try {
		await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS students (
				id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
				name text NOT NULL,
				phone text NOT NULL UNIQUE,
				enrolled_courses jsonb DEFAULT '[]',
				certificates jsonb DEFAULT '[]',
				created_at timestamp DEFAULT now()
			);
		`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS courses (
				id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
				title text NOT NULL,
				description text NOT NULL,
				detailed_description text,
				category text NOT NULL,
				duration text NOT NULL,
				icon text NOT NULL,
				is_active boolean DEFAULT true,
				enrollment_count text DEFAULT '0',
				created_at timestamp DEFAULT now()
			);
		`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS certificates (
				id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
				student_id varchar REFERENCES students(id),
				course_id varchar REFERENCES courses(id),
				issue_date timestamp DEFAULT now(),
				certificate_url text,
				verification_code text NOT NULL UNIQUE
			);
		`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS admins (
				id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
				username text NOT NULL UNIQUE,
				password text NOT NULL,
				created_at timestamp DEFAULT now()
			);
		`);
		await client.query(`
			CREATE TABLE IF NOT EXISTS announcements (
				id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
				title text NOT NULL,
				content text NOT NULL,
				is_active boolean DEFAULT true,
				created_at timestamp DEFAULT now()
			);
		`);
		ensured = true;
	} finally {
		client.release();
	}
}