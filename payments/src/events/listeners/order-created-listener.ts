import { Listener, OrderCreatedEvent,Subjects } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import pool from "../../config/db";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data:OrderCreatedEvent['data'], msg:Message){
        const {id,status,version,user_id,ticket} = data

        const q = "INSERT INTO orders (id,status,version,price,user_id) VALUES ($1,$2,$3,$4,$5)"
        await pool.query(q,[id,status,version,ticket.price,user_id]) 
        msg.ack()
    }
}