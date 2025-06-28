import { TicketCreated } from "@xgettickets/common"
import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Message } from "node-nats-streaming"
import pool from "../../../config/db"

const setup = async () => {
    // creates an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)

    // create a fake data event
    const data: TicketCreated['data'] = {
        version:0,
        id:'1',
        title:'hoodflick',
        price:10.00,
        user_id:'1',
    }
    // create a fake message object
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
}
it('creates and saves a ticket', async() => {
    const {listener, data, msg} = await setup()

    // call the on message function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created 
    const q = "SELECT * FROM tickets WHERE id = $1"
    const {rows} = await pool.query(q,[data.id])
    const ticket = rows[0]
    expect(ticket).toBeDefined()
    expect(ticket.title).toEqual(data.title)
    expect(Number(ticket.price)).toEqual(data.price)
})

it('acks the message', async () => {
    const {listener, data, msg} = await setup()

    // call the on message function with the data object + message object
    await listener.onMessage(data,msg)

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled()
})