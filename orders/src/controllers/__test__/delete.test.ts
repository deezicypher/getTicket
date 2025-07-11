import request from "supertest"
import { app } from "../../app"
import { signin } from "../../utils/test/signin";
import {pool} from "../../test/testSetup";
import { natsWrapper } from "../../nats-wrapper";


const buildTicket = async () => {
    const ticketq = 'INSERT INTO tickets (title,price,user_id) VALUES ($1,$2,$3) RETURNING *'
    const {rows} = await pool.query(ticketq,['hoodzone',200,1])
   return rows[0].id
}

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