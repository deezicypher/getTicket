import { Listener, OrderCreatedEvent, Subjects } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import pool from "../../config/db";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated_publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'], msg:Message){
        // Find the ticket the order is reserving 
        
        const q = "SELECT * FROM tickets WHERE id = $1"
        const {rows} = await pool.query(q,[data.ticket.id])
        const ticket = rows[0]
     
        // if no ticket, throw error
        if(rows.length === 0 ) {
            throw new Error('Ticket not found')
        }

        // Mark the ticket as being reserved by setting it's orderId properly
        const updateQ = "UPDATE tickets SET order_id = $1,version = version + 1 WHERE id = $2 AND version = $3 RETURNING *"
        const {rows: updatedRows} = await pool.query(updateQ,[data.id,data.ticket.id,ticket.version])
        const updatedTicket = updatedRows[0]
   
        await new TicketUpdatedPublisher(this.client).publish({
            id:updatedTicket.id,
            price:updatedTicket.price,
            title:updatedTicket.title,
            user_id:updatedTicket.user_id,
            version:updatedTicket.version,
            order_id:updatedTicket.order_id
        })
        // ack the message
        msg.ack();
    }
}