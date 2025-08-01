import { Listener, OrderCreatedEvent, Subjects } from "@xgettickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    

    async onMessage(data:OrderCreatedEvent['data'], msg:Message) {
        const delay = new Date(data.expires_at).getTime() - new Date().getTime()
        
        console.log('Waiting this milliseconds to process the job:', delay)

        await expirationQueue.add(
            {orderId:data.id}
            // ,{delay}
        )
        msg.ack()
    }
}