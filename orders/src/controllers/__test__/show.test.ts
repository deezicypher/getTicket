import request from "supertest"
import { app } from "../../app"
import { signin } from "../../utils/test/signin";
import {pool} from "../../test/testSetup";


 
const buildTicket = async () => {
    const ticketq = 'INSERT INTO tickets (title,price,user_id) VALUES ($1,$2,$3) RETURNING *'
    const {rows} = await pool.query(ticketq,['hoodzone',200,1])
   return rows[0].id
}



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