import { Listener,OrderCancelledEvent, Subjects } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import pool from "../../config/db";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated_publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data:OrderCancelledEvent['data'], msg: Message) {
        const q = "SELECT * FROM tickets WHERE id = $1"
        const {rows} = await pool.query(q,[data.ticket.id])
        if(rows.length === 0 ) {
            throw new Error('Ticket not found')
        }
        const ticket = rows[0]
        const updateQ = "UPDATE tickets SET order_id = $1, version = version +1 WHERE id = $2 AND version = $3 RETURNING *"
        const {rows:updatedRow} = await pool.query(updateQ,[undefined,ticket.id,ticket.version])
        const updatedTicket = updatedRow[0]
        await new TicketUpdatedPublisher(this.client).publish({
            id:updatedTicket.id,
            price:updatedTicket.price,
            title:updatedTicket.title,
            user_id:updatedTicket.user_id,
            version:updatedTicket.version,
            order_id:updatedTicket.order_id
        })

        msg.ack()
        
    }
}