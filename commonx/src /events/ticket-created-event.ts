import { Subjects } from "./subjects";

export interface TicketCreated{
    subject:Subjects.TicketCreated
    data: {
        id: string;
        title:string;
        price:number;
        version:number;
        user_id:string;
    }
}