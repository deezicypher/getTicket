import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import pool  from "../../../config/db";
import { OrderCancelledEvent } from "@xgettickets/common";
import { Message } from "node-nats-streaming";


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const data = {
        title:'hoodflick',
        price:10.00,
        user_id:'1',
    }
    const order_id = '1'
    const q = "INSERT INTO tickets (title, price, user_id) VALUES ($1,$2,$3) RETURNING *"
    const {rows} = await pool.query(q,[data.title,data.price,data.user_id])
    const ticket = rows[0]

    const updateQ = "UPDATE tickets SET order_id = $1 WHERE id = $2  RETURNING *"
    await pool.query(updateQ,[order_id,ticket.id])
    

    const fdata : OrderCancelledEvent['data'] = {
        id:'1',
        version:0,
        ticket:{
            id:ticket.id
        }
    }

    const msg = {
        ack: jest.fn()
    } as unknown as Message

    return {listener, fdata, ticket,order_id, msg}
}

it('updates the ticket, publishes an event, and acks the message', async () => {
    const {msg, fdata, ticket, order_id, listener} = await setup()
    
    await listener.onMessage(fdata, msg)

    const q = "SELECT * FROM tickets WHERE id = $1"
    const {rows} = await pool.query(q,[ticket.id])
    const updatedTicket = rows[0]

    expect(updatedTicket.order_id).toBeNull();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
}) 