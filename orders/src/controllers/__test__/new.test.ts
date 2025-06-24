import request from "supertest"
import { app } from "../../app"
import { signin } from "../../utils/test/signin";
import {pool} from "../../test/testSetup";
import { natsWrapper } from "../../__mocks__/nats-wrapper";



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

it('Emits an order created event', async() => {
    const cookie = signin();
    const ticketq = 'INSERT INTO tickets (title,price) VALUES ($1,$2) RETURNING *'
    const {rows} = await pool.query(ticketq,['hoodzone',200])
    const ticketId = rows[0].id
    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ticketId})
        .expect(201)
   

      expect(natsWrapper.client.publish).toHaveBeenCalled();
        
})

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
    const {body:order1} = await request(app)
     .post('/api/orders')
     .set('Cookie', user2)
     .send({ticketId:ticket2})
     .expect(201)

     const {body:order2} = await request(app)
     .post('/api/orders')
     .set('Cookie', user2)
     .send({ticketId:ticket3})
     .expect(201)

    //make request to get orders for user #2

    const res = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200)
    expect(res.body.length).toEqual(2)
    // Order list is Ordered By DESC
    expect(res.body[1].id).toEqual(order1.id)
    expect(res.body[0].id).toEqual(order2.id)

})


// fetch Order test

it('fetches the order', async ()=>{

    // create the ticket
    const ticket = await buildTicket()
    const cookie = signin();

    // make a request to build an order with this ticket
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ticketId:ticket})
        .expect(201)

    // make request to fetch the order
    const {body:fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200)
    expect(fetchedOrder.id).toEqual(order.id)
  

})

it('returns an error, if one user tries to fetch another users order', async ()=>{

    // create the ticket
    const ticket = await buildTicket()
    const cookie = signin();

    // make a request to build an order with this ticket
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ticketId:ticket})
        .expect(201)

    // make request to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', signin())
        .send()
        .expect(401)

})


// Delete test

it('Marks an order as cancelled', async () => {
    const cookie = signin();
    // create a ticket with Ticket model
    const ticket = await buildTicket()
    // make a request to create an order
    const {body:order} = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ticketId:ticket})
    .expect(201)
   
    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200)

    // expectation to make sure the thing is cancelled

    const {body:deletedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

    expect(deletedOrder.status).toEqual('cancelled')

})

it('it emits an order cancelled event', async() => {
    const cookie = signin();
    // create a ticket with Ticket model
    const ticket = await buildTicket()
    // make a request to create an order
    const {body:order} = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ticketId:ticket})
    .expect(201)
   
    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200)

    // expectation to make sure the thing is cancelled

    await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})