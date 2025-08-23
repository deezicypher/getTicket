import { newDb } from 'pg-mem';

const db = newDb();
const adapter = db.adapters.createPg();
const { Pool } = adapter;
const pool = new Pool();

jest.mock('../config/db', () => ({
   __esModule: true, default: pool  
}))

class DatabaseError extends Error {
  constructor( 
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';  
  }
}

beforeAll(async () => {
   try {
      // Create tables if they don't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tickets (
          id SERIAL PRIMARY KEY,
          title VARCHAR(225) NOT NULL,
          price DECIMAL NOT NULL,
          version INTEGER NOT NULL DEFAULT 0,
          order_id INTEGER,
          user_id INTEGER NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await pool.query(createTableQuery);
    } catch (error) {
      console.log(error)
      throw new DatabaseError('Failed to setup test database', error);
    }
});
jest.mock('../nats-wrapper')

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS tickets');;
});

beforeEach(async () => {
  jest.clearAllMocks()
  await  pool.query('TRUNCATE TABLE tickets RESTART IDENTITY CASCADE');
});
