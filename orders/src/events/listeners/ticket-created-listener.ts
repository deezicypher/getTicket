import { Message } from "node-nats-streaming";
import { Subjects,Listener,TicketCreated } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import pool from "../../config/db";

export class TicketCreatedListener extends Listener<TicketCreated> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = queueGroupName

    async onMessage(data: TicketCreated['data'], msg: Message){
        const {title,id, price,version,user_id} = data;
        const q = "INSERT INTO tickets (id,title,price,version,user_id) VALUES ($1,$2,$3,$4,$5)"
        const {rows} = await pool.query(q,[id,title,price,version,user_id])
        const ticket = rows[0]
        msg.ack()
    }   
}