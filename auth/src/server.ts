import { app } from "./app";
import pool from "./config/db"

const start = async () => {
  if (!process.env.POSTGRES_DB || !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD 
    || !process.env.ACTIVE_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET 
    || !process.env.REFRESH_TOKEN_SECRET || !process.env.CLIENT_URL
) {
    throw new Error("Missing required environment variables");
}
  try {
    await pool.connect()
    console.log('Starting application')
    console.log("Connected to DB")
    await pool.query(`CREATE TABLE IF NOT EXISTS "users" (
      "id" SERIAL PRIMARY KEY,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "password" varchar NOT NULL,
      "role" varchar NOT NULL DEFAULT 'USER',
      "created_at" timestamptz NOT NULL DEFAULT (now())
    );`);
    console.log("Created Table users")
    app.listen(3000,()=>{
      console.log('Listening on port 3000')
  })
  }catch (err:any) {
    console.error("Error connecting to DB:", err.message); 
    process.exit(1); 
  }

}

start()