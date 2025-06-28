import { Pool, QueryResult } from 'pg';
import dotenv from "dotenv";

dotenv.config();

// Define types
interface DatabaseConfig {
  connectionString: string;
}

interface TableExistsResult {
  exists: boolean; 
}

// Custom error class for database operations
class DatabaseError extends Error {
  constructor( message: string,public readonly originalError?: unknown) {
    super(message);
    this.name = 'DatabaseError';  
  }
}

// Create a new pool for the test database
const config: DatabaseConfig = {
  connectionString: process.env.TEST_DATABASE_URL || '',
};

if (!config.connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool(config);




// Function to check if table exists
const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const result: QueryResult<TableExistsResult> = await pool.query(
      `SELECT EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_name = $1
       ) AS exists`,
      [tableName]
    );
    return result.rows[0].exists; 
  } catch (error) {

    throw new DatabaseError(`Failed to check if table ${tableName} exists`, error);
  }
};

// Function to setup the test database
export const setupTestDb = async (): Promise<void> => {
  try {
    // Create tables if they don't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        status VARCHAR(225) NOT NULL,
        user_id INTEGER NOT NULL,
        ticket_id INTEGER NOT NULL,
        version INTEGER NOT NULL DEFAULT 0,
        expires_at TIMESTAMPTZ NOT NULL, 
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(225) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        version INTEGER NOT NULL DEFAULT 0,
        user_id INTEGER NOT NULL
      );
    `;
    await pool.query(createTableQuery);
  } catch (error) {
    console.log(error)
    throw new DatabaseError('Failed to setup test database', error);
  }
};

// Function to clear all test data
export const clearTestData = async (): Promise<void> => {
  try {
    const ordersExist = await tableExists('orders');
    const ticketsExist = await tableExists('tickets');

    if (ordersExist) {
      await pool.query('TRUNCATE TABLE orders RESTART IDENTITY CASCADE');
    }

    if (ticketsExist) {
      await pool.query('TRUNCATE TABLE tickets RESTART IDENTITY CASCADE');
    }

  } catch (error) {
    throw new DatabaseError('Failed to clear test data', error);
  }
};

// Function to tear down the test database
export const tearDownTestDb = async (): Promise<void> => {
  try {
    await pool.query('DROP TABLE IF EXISTS orders');
    await pool.query('DROP TABLE IF EXISTS tickets');
    await pool.end();
  } catch (error) {
    throw new DatabaseError('Failed to tear down test database', error);
  }
};

export { pool };
