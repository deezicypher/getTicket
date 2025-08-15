import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent,OrderStatus,Subjects } from "@xgettickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { pool } from "../../../test/testSetup";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = await new OrderCancelledListener(natsWrapper.client)


    const orderQ = "INSERT INTO orders (id,status,version,price,user_id) VALUES ($1,$2,$3,$4,$5)"
    const {rows} = await pool.query(orderQ,[1,OrderStatus.Created,0,50,1])
    const order = rows[0]

    const data:OrderCancelledEvent['data'] = {
        id:'1',
        version:1,
        ticket:{
            id:'1',
        }
    }

    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener,order,data,msg }
}

it('updates the status of the order', async () => {
    const {listener,data, msg, order} = await setup()
    await listener.onMessage(data,msg)

    const updatedOrderQ = "SELECT * FROM orders WHERE id=$1"
    const {rows:updatedOrderRow} = await pool.query(updatedOrderQ,[data.id]) 
    const updatedOrder = updatedOrderRow[0]

    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
    const {listener,data, msg, order} = await setup()
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})