import { app } from "./app";
import pool from "./config/db"
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
  if(!process.env.NODE_ENV) {
  if (!process.env.NATS_URL || !process.env.NATS_CLUSTER_ID || !process.env.NATS_CLIENT_ID || !process.env.POSTGRES_TICKETS_DB || !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD 
    || !process.env.ACTIVE_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET 
    || !process.env.REFRESH_TOKEN_SECRET || !process.env.CLIENT_URL
) {
    throw new Error("Missing required environment variables");
}
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!,process.env.NATS_CLIENT_ID!,process.env.NATS_URL!)
    natsWrapper.client.on('close', ()=> {
      console.log('NATS connection closed')
      process.exit()
  })
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  new  OrderCreatedListener(natsWrapper.client).listen();
  new  OrderCancelledListener(natsWrapper.client).listen();

    await pool.connect()
    console.log("Connected to DB")
      const createTableQuery = `
          CREATE TABLE IF NOT EXISTS tickets (
            id SERIAL PRIMARY KEY,
            title VARCHAR(225) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            version INTEGER NOT NULL DEFAULT 0,
            user_id INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await pool.query(createTableQuery);
        console.log("Created Tickets table")

    app.listen(3000,()=>{
      console.log('Listening on port 3000')
  })
  }catch (err:any) {
    console.error("Error connecting to DB:",err.message,err); 
    process.exit(1); 
  }

}

start()