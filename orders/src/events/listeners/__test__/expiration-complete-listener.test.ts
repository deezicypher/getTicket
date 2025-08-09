import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper"
import { Message } from "node-nats-streaming"
import { pool } from "../../../test/testSetup"
import { ExpirationCompleteEvent, OrderStatus } from "@xgettickets/common";


const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    const tdata = {
        id:'1',
        version:0,
        title:'hoodflick',
        price:10.00,
        user_id:'1', 
    }
    const q = "INSERT INTO tickets (id,title,price,version,user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *"
    const {rows} = await pool.query(q,[tdata.id,tdata.title,tdata.price,tdata.version,tdata.user_id])
    const ticket = rows[0]

    const orderQ = "INSERT INTO orders (status,user_id,version,ticket_id,expires_at) VALUES ($1,$2,$3,$4,$5) RETURNING *"
    const {rows:orderRows} = await pool.query(orderQ,[OrderStatus.Created,'1',0,ticket.id,new Date()])
    const order = orderRows[0]


    const data:ExpirationCompleteEvent['data'] = {
        orderId:order.id
    }

        //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }

    return {listener,ticket,order,data,msg}
}


it('updates the order status to cancelled', async () => {
    const {listener,order,data,msg} = await setup()
    await listener.onMessage(data,msg)

   
    const q = "SELECT * FROM orders WHERE id = $1"
    const {rows} = await pool.query(q,[order.id])
    const updatedOrder = rows[0]

    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)

})

it('omits an order cancelled event', async () => {
    const {listener,order,data,msg} = await setup()
    await listener.onMessage(data,msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(eventData.id).toEqual(order.id)
})

it('acks the message', async () => {
    const {listener,order,data,msg} = await setup()
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})