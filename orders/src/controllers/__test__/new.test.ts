import request from "supertest"
import { app } from "../../app"
import { signin } from "../../utils/test/signin";
import {pool} from "../../test/testSetup";


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
    const cookie = signin();
    const ticketq = 'INSERT INTO tickets (title,price) VALUES ($1,$2) RETURNING *'
    const {rows} = await pool.query(ticketq,['hoodzone',200])
    const ticketId = rows[0].id
    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ticketId})
        .expect(201)

})

it.todo('Emits an order created event')

//Index Test

const buildTicket = async () => {
    const ticketq = 'INSERT INTO tickets (title,price) VALUES ($1,$2) RETURNING *'
    const {rows} = await pool.query(ticketq,['hoodzone',200])
   return rows[0].id
}
it('fetches orders from a particular user', async () => {
    // create three tickets
    const ticket1 = await buildTicket()
    const ticket2 = await buildTicket()
    const ticket3 = await buildTicket()

    const user1 = signin();
    const user2 = signin();

    //create one order as user #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ticketId:ticket1})
        .expect(201)
    
     //create two orders as user #2
     await request(app)
     .post('/api/orders')
     .set('Cookie', user2)
     .send({ticketId:ticket2})
     .expect(201)

     await request(app)
     .post('/api/orders')
     .set('Cookie', user2)
     .send({ticketId:ticket3})
     .expect(201)

     //make request to get orders for user #2

     const res = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200)
    
    console.log(res.body)

})