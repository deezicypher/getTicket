import { Subjects } from "./subjects";

export interface TicketUpdated{
    subject:Subjects.TicketUpdated
    data: {
        id:string;
        title:string;
        price:number;
        user_id:string;
        version:number;
    }
}