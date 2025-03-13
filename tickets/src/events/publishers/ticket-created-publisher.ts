import { Publisher,TicketCreated,Subjects } from "@xgettickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreated>{
    readonly subject = Subjects.TicketCreated
}