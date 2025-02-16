import { Pool } from 'pg';

const poolConfig = process.env.NODE_ENV === 'test'
? {
    connectionString: process.env.DATABASE_URL, // Use connection string for testing
  }
: {
    user: process.env.POSTGRES_USER, // Use individual credentials for non-test environments
    host: 'tickets-postgres-srv', // This should match your Postgres service name
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  };
  console.log('Using pool config:', poolConfig);
const pool = new Pool(poolConfig);

export default pool