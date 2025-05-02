import { Message } from "node-nats-streaming";
import { Subjects,TicketUpdated,Listener } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import pool from "../../config/db";

export class TicketUpdatedListener extends Listener<TicketUpdated> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdated['data'], msg: Message){
        const {title, price, id,version} = data
            const q = "SELECT * FROM tickets WHERE id = $1"
            const {rows} = await pool.query(q,[id])
            if(rows.length === 0 ){
                throw new Error('Ticket not found')
            }
         
            const ticket = rows[0];

            if (ticket.version !== version - 1) {
                
                console.warn(`Version mismatch for ticket ${id}. Expected ${ticket.version + 1}, got ${version}`);
                return;
            }

            const updateq = "UPDATE tickets SET title = $1, price = $2, version = $3 WHERE id = $4"
            await pool.query(updateq, [title, price, id,version])
            msg.ack()
            
    }   

}