import { Subjects, Listener, PaymentCreatedEvent,OrderStatus } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import pool from "../../config/db";


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName = queueGroupName

    async onMessage(data: PaymentCreatedEvent['data'],msg:Message){
        const q = "SELECT * FROM orders WHERE id = $1"
        const {rows} = await pool.query(q,[data.orderId])
        const order = rows[0]

        if(!order){
            throw new Error('Order not found')
        }

        const updateQ = "UPDATE orders SET status = $1 WHERE id = $2"
        await pool.query(updateQ,[OrderStatus.complete,data.orderId]) 
        msg.ack()
    }
}