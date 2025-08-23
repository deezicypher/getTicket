import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import pool from "../../../config/db";
import { OrderCreatedEvent, OrderStatus } from "@xgettickets/common";
import { Message } from "node-nats-streaming";


const setup = async () => {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    const data = {
        title:'hoodflick',
        price:10.00,
        user_id:'1',
    }
    const q = "INSERT INTO tickets (title, price, user_id) VALUES ($1,$2,$3) RETURNING *"
    const {rows} = await pool.query(q,[data.title,data.price,data.user_id])
    const ticket = rows[0]

    // create fake data event
    const fdata:OrderCreatedEvent['data'] = {
                id: '1',
                status: OrderStatus.Created,
                user_id: '1',
                expires_at: 'noon',
                version: 0,
                ticket: {
                    id: ticket.id,
                    price: ticket.price,
                }
            };
     
    const msg = {
        ack: jest.fn()
    } as unknown as Message
         
    return {listener, ticket, fdata, msg}
};

it('sets the orderId of the ticket', async () => {
    const {listener,ticket,fdata,msg} = await setup()
    await listener.onMessage(fdata, msg);

    const q = "SELECT * FROM tickets WHERE id = $1"
    const {rows} = await pool.query(q,[ticket.id])
    const updatedTicket = rows[0]
    
    expect(updatedTicket.order_id).toEqual(Number(fdata.id))
})

it('acks the message', async () => {
    const {listener, fdata, msg} = await setup()
    await listener.onMessage(fdata,msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('Publishes a ticket updated event', async () => {
    const {listener, ticket, fdata, msg} = await setup()

    await listener.onMessage(fdata,msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const updatedTicketData =  JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    
})