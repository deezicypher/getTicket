import { Pool } from 'pg';
import request from 'supertest';
import dotenv from "dotenv"
import { app } from '../app';
dotenv.config()


// Create a new pool for the test database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
  // Run migrations or seed the database before running tests
  await pool.query(`CREATE TABLE "tickets" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(225) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`);
});


afterAll(async () => {
  // Clean up the database after tests
  await pool.query('DROP TABLE IF EXISTS tickets');
  await pool.end();
}); 
 
beforeEach(async () => {
    // Clear the users table before each test
    await pool.query('DELETE FROM tickets');
  });



