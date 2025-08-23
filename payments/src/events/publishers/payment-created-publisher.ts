import { Subjects,Publisher,PaymentCreatedEvent } from "@xgettickets/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}