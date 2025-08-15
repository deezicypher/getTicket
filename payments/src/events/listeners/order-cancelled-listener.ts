import { OrderCancelledEvent, Listener, Subjects, OrderStatus } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import pool from "../../config/db";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        const {version,id}=data
        const q = "SELECT * FROM orders WHERE id=$1 AND version = $2 - 1 "
        const {rows} = await pool.query(q,[id,version])
        const order = rows[0]

        if(!order){
            throw new Error('Order not found')
        }

        const cancelOrderQ = "UPDATE orders SET status= $1 WHERE id = $2"
        await pool.query(cancelOrderQ,[OrderStatus.Cancelled,id])
        msg.ack()

    }
}