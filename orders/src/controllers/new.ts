import  {Request, Response} from 'express'
import { validationResult } from 'express-validator'
import pool from '../config/db'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { OrderStatus } from '@xgettickets/common'
import { natsWrapper } from '../nats-wrapper'

const NewOrder = async (req:Request, res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const firstError = errors.array().map(err => err.msg)[0]
        res.status(422).json({error:firstError})
        return
    }

    // Find the ticket the user is trying to order in the database
    try{
    const {ticketId} = req.body

    const ticketq = "SELECT * from tickets WHERE id = $1"
    const {rows } = await pool.query(ticketq,[ticketId])
    if (rows.length === 0){
        res.status(404).json({error: "Ticket not found"})
        return
    }
    const ticketresult = rows[0]

    // Make sure that this ticket is not already reserved. 

    const orderq = "SELECT * from orders WHERE ticket_id = $1 AND status != 'cancelled' "

    const orderResult = await pool.query(orderq,[ticketresult.id])

    if(orderResult.rows.length > 0) {
        res.status(400).json({error: "Ticket is unavailable"})
        return
    }

    // Calculate an expiration date for this order
    const expirationDate = new Date()
    expirationDate.setMinutes(expirationDate.getMinutes() + 1)

    let version = 0
    // Build the order and save it to the database
    const buildq = 'INSERT INTO orders (status,user_id,version,ticket_id,expires_at) VALUES ($1,$2,$3,$4,$5) RETURNING *'
    const {rows:order} = await pool.query(buildq,['created',req.user?.id,version,ticketresult.id,expirationDate])

    // Publish an event saying an order was created

    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id:order[0].id,
        status:OrderStatus.Created,
        user_id: String(req.user?.id),
        version,
        expires_at: expirationDate.toISOString(),
        ticket:{
            id:ticketId,
            price:ticketresult.price,
        }
    })
  
    res.status(201).send(order[0])
    return
}catch(err) {
    console.log(err)
}
    
}

export default NewOrder