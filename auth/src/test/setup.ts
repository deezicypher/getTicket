import { Pool } from 'pg';
import dotenv from "dotenv"
import { app } from '../app';
dotenv.config()



// Create a new pool for the test database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
  // Run migrations or seed the database before running tests
  await pool.query(`CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "role" varchar NOT NULL DEFAULT 'USER',
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );`);
});


afterAll(async () => {
  // Clean up the database after tests
  await pool.query('DROP TABLE IF EXISTS users');
  await pool.end();
});

beforeEach(async () => {
    // Clear the users table before each test
    await pool.query('DELETE FROM users');
  });