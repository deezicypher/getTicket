import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { pool } from "../../../test/testSetup";
import { TicketUpdated } from "@xgettickets/common";
import { Message } from "node-nats-streaming";
 

const setup = async () => {
    // create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create and save a ticket
    const tdata = {
        version:0,
        id:'2',
        title:'hoodflick',
        price:10.00,
        user_id:'1',
    }
    const q = "INSERT INTO tickets (id,title,price,version,user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *"
    const {rows} = await pool.query(q,[tdata.id,tdata.title,tdata.price,tdata.version,tdata.user_id])
    const ticket = rows[0]
    // create a fake data object
    const data : TicketUpdated['data'] = {
        id:ticket.id,
        version: ticket.version  + 1,
        title:'Hood Slick',
        price:50.00,
        user_id:'1'
    }

    // Create a fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    // return all 
    return {listener,data,msg,ticket}
};

it('Finds, updates and saves a ticket', async () => {
    const {msg,data,ticket,listener} = await setup();
    await listener.onMessage(data,msg)

    const q = "SELECT * FROM tickets WHERE id = $1"
    const {rows} = await pool.query(q,[ticket.id])
    const updatedTicket = rows[0]

    expect(updatedTicket.title).toEqual(data.title)
    expect(Number(updatedTicket.price)).toEqual(data.price)
    expect(updatedTicket.version).toEqual(data.version)

});

it('acks the message', async () => {
    const {msg,data,listener} = await setup();
    await listener.onMessage(data,msg)
    expect(msg.ack).toHaveBeenCalled();
});

it('Does not call ack if the event has a skipped version number', async () => {
    const {msg,data, listener} = await setup()
    data.version = 10

    try {
        await listener.onMessage(data,msg)
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();

})