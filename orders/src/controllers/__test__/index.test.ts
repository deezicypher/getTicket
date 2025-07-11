import request from "supertest"
import { app } from "../../app"
import { signin } from "../../utils/test/signin";
import {pool} from "../../test/testSetup";


const buildTicket = async () => {
    const ticketq = 'INSERT INTO tickets (title,price,user_id) VALUES ($1,$2,$3) RETURNING *'
    const {rows} = await pool.query(ticketq,['hoodzone',200,1])
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