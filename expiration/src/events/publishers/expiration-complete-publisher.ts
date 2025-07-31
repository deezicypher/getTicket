import { Subjects,Publisher, ExpirationCompleteEvent  } from "@xgettickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject:Subjects.ExpirationComplete = Subjects.ExpirationComplete
    
}