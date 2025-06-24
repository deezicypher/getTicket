import { Publisher,Subjects,OrderCreatedEvent } from "@xgettickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}