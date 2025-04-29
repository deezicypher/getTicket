import { Subjects,Publisher,OrderCancelledEvent } from "@xgettickets/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}