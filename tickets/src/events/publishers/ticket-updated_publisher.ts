import { Publisher,Subjects, TicketUpdated } from "@xgettickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdated>{
    readonly subject = Subjects.TicketUpdated
}