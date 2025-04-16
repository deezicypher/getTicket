import request from "supertest"
import { app } from "../../app"
import { signin } from "../../utils/test/signin";
import dotenv from "dotenv";
import { Pool } from 'pg';

dotenv.config();

// Define types
interface DatabaseConfig {
  connectionString: string;
}

// Create a new pool for the test database
const config: DatabaseConfig = {
  connectionString: process.env.TEST_DATABASE_URL || '',
};

if (!config.connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool(config);


it('returns an error if the ticket does not exist', async () => {
    const cookie = signin();
    const ticketId = 1

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ticketId})
        .expect(404)

})

it('returns an error if the ticket is already reserved', async () => {
    const cookie = signin();

    const ticketq = 'INSERT INTO tickets (title,price) VALUES ($1,$2) RETURNING *'
    const {rows} = await pool.query(ticketq,['hoodzone',200])
    const ticketId = rows[0].id
    const orderq = 'INSERT INTO orders (status,user_id,ticket_id,expires_at) VALUES ($1,$2,$3,$4) RETURNING *'
    const expirationDate = new Date()
     await pool.query(orderq,['created',1,ticketId,expirationDate])

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ticketId})
        .expect(400)

})

it('reserves a ticket', async () => {

})