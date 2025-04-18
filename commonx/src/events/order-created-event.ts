import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
    subject:OrderStatus.Created;
    data:{
        id:string;
        status:OrderStatus;
        user_id:string;
        expires_at:string;
        ticket:{
            id:string;
            price:number
        }
    }
}