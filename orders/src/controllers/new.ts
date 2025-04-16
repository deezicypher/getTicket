import  {Request, Response} from 'express'
import { validationResult } from 'express-validator'
import pool from '../config/db'

const NewOrder = async (req:Request, res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const firstError = errors.array().map(err => err.msg)[0]
        res.status(422).json({error:firstError})
        return
    }

    // Find the ticket the user is trying to order in the database
    const {ticketId} = req.body

    const ticketq = "SELECT * from tickets WHERE id = $1"
    const {rows} = await pool.query(ticketq,[ticketId])
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
    expirationDate.setMinutes(expirationDate.getMinutes() + 15)


    // Build the order and save it to the database
    const buildq = 'INSERT INTO orders (status,user_id,ticket_id,expires_at) VALUES ($1,$2,$3,$4) RETURNING *'
    const buildres = await pool.query(buildq,['created',req.user?.id,ticketresult.id,expirationDate])

    // Publish an event saying an order was created
    res.status(201).send(buildres.rows[0])
    return
    
}

export default NewOrder