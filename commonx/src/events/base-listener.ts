import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects,
    data: any
}

// T extends Event makes sure that when you create another listener, it has all the required properties of an Event,
//The benefit is that when someone creates a specific listener (like my TicketCreatedListener), 
// they can specify exactly what type of event it handles, making the code more type-safe while maintaining flexibility.

export abstract class Listener<T extends Event> {
    abstract subject: T["subject"];
    abstract queueGroupName:string;  
    abstract onMessage(data:T['data'], msg:Message):void  
    private client:Stan;
    protected ackWait = 5 * 1000;

    constructor(client:Stan) {
        this.client = client;
    }

    subscriptionOptions () {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(this.subject,this.queueGroupName,this.subscriptionOptions());
        subscription.on('message', (msg:Message)=>{
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
            const parseData = this.parseMessage(msg)
            this.onMessage(parseData, msg)
        })
    }
    parseMessage (msg:Message) {
        const data = msg.getData();
        return typeof data === 'string' ?
        JSON.parse(data) :
        JSON.parse(data.toString('utf8'))
    }
}