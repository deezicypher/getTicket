// testSetup.ts
import { newDb } from 'pg-mem';
import { Pool } from 'pg';

// One shared pg-mem DB for the whole test suite
const db = newDb();
const adapter = db.adapters.createPg();
const pool = new adapter.Pool() as unknown as Pool;

export { db, pool };

export const setupTestDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER NOT NULL, 
      status VARCHAR(225) NOT NULL,
      user_id INTEGER NOT NULL,
      version INTEGER NOT NULL DEFAULT 0,
      price DECIMAL NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL,
            stripe_id VARCHAR(225) NOT NULL
          );
  `);
};

export const clearTestData = async () => {
  await pool.query('TRUNCATE TABLE orders RESTART IDENTITY CASCADE');
};

export const tearDownTestDb = async () => {
  await pool.query('DROP TABLE IF EXISTS orders');
};
