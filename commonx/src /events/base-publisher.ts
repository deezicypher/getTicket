import { Stan } from "node-nats-streaming"
import { Subjects } from "./subjects"


interface Event {
    subject: Subjects,
    data: any
}

// T is a generic type parameter (a placeholder for a type you’ll specify later).
// extends Event means “whatever type replaces T must be a subtype of Event (or exactly Event)

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject']
    protected client:Stan

    constructor(client:Stan) {
        this.client = client
    }

    publish(data: T['data']):Promise<void>{
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    reject(err)
                }
                console.log('Event published to subject', this.subject)
                resolve()
            })
        })
      
    }
}