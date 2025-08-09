import { Subjects,Listener,ExpirationCompleteEvent, OrderStatus } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import pool from "../../config/db";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
    queueGroupName = queueGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message){
        const q = "SELECT * FROM orders WHERE id = $1"
        const {rows} = await pool.query(q,[data.orderId])
        const order = rows[0]

        if(!order){
            throw new Error('Order not found')
        }
        const updateQ = "UPDATE orders SET status= $1 WHERE id = $2"
        await pool.query(updateQ,[OrderStatus.Cancelled,data.orderId])
        await new OrderCancelledPublisher(this.client).publish({
            id:order.id,
            version:order.version,
            ticket:{
                id:order.ticket_id
            }
        })

        msg.ack()
    }
}