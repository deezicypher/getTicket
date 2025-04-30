import { Message } from "node-nats-streaming";
import { Subjects,TicketUpdated,Listener } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import pool from "../../config/db";

export class TicketUpdatedListener extends Listener<TicketUpdated> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdated['data'], msg: Message){
            const q = "SELECT * FROM tickets WHERE id = $1"
            const {rows} = await pool.query(q,[data.id])
            if(rows.length === 0 ){
                throw new Error('Ticket not found')
            }
            const {title, price, id} = data
            const updateq = "UPDATE tickets SET title = $1, price = $2 WHERE id = $3"
            await pool.query(updateq, [title, price, id])
            msg.ack()
    }   

}