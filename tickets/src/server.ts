import { app } from "./app";
import pool from "./config/db"

const start = async () => {
  if(!process.env.NODE_ENV) {
  if (!process.env.POSTGRES_TICKETS_DB || !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD 
    || !process.env.ACTIVE_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET 
    || !process.env.REFRESH_TOKEN_SECRET || !process.env.CLIENT_URL
) {
    throw new Error("Missing required environment variables");
}
  }
  try {
    await pool.connect()
    console.log("Connected to DB")
    app.listen(3000,()=>{
      console.log('Listening on port 3000')
  })
  }catch (err:any) {
    console.error("Error connecting to DB:",err.message,err); 
    process.exit(1); 
  }

}

start()