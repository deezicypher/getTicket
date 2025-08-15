import { Message } from "node-nats-streaming"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@xgettickets/common"
import { pool } from "../../../test/testSetup"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const data: OrderCreatedEvent['data'] = {
        id:'1',
        version:0,
        expires_at:'12',
        user_id:'1',
        status:OrderStatus.Created,
        ticket:{
            id:'1',
            price:50.00
        }
    }

    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }
    
    return {listener,data,msg}
}

it('replicates the order info', async () => {
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg)

    const q = "SELECT * from orders WHERE id=$1"
    const {rows} = await pool.query(q,[data.id])
    const order = rows[0]
    expect(order.price).toEqual(data.ticket.price)
})

it('acks the message', async () => {
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})