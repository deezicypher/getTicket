import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../config/db";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated_publisher";
import { natsWrapper } from "../nats-wrapper";
import { version } from "node-nats-streaming";


export const CreateTicket = async (req:Request, res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        res.status(422).json({error:firstError})
        return
    }

    try {
    const {title,price} = req.body

    // normalize inputs
    const normalizedTitle = title.toLowerCase().trim()

    // Get user id
    const id = req.user?.id

    // the insert ticket query
    const q = 'INSERT INTO tickets (title,price,user_id) VALUES ($1,$2,$3) RETURNING *'

    // use await to handle the query and store the result in a variable
    const {rows} = await pool.query(q,[normalizedTitle,price,id])
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id:rows[0].id,
        title: rows[0].title,
        price: rows[0].price,
        version:rows[0].version
    })
    res.status(201).send(rows[0])
    return
    }catch(err){
        console.log(err)
        res.status(500).json({error:"Unable to proceed further at the moment"})
    }
 
}

export const GetTicket = async (req:Request, res:Response) => {
    const {id} = req.params
    const input = id.trim()
    if(isNaN(Number(input))) {
        res.status(422).json({error: "Invalid input: expected an integer"})
        return
    }
    try{
        // retrive the ticket query
        const q = "SELECT * from tickets WHERE id = $1"
        // Use await to wait for the result of the query, ensures that the query is executed and completes before proceeding.
        const {rows} = await pool.query(q,[id])
        if (rows.length === 0){
            res.status(404).json({error: "Ticket not found"})
            return
        }
        const result = rows[0]
        res.send(result)

    }catch(err) {
        console.log(err)
        res.status(500).json({error: "Can't proceed further at the moment."})
    }
}

export const GetTickets = async (req:Request, res:Response) => {
    try {
        // retrieve tickets query
        const q = "SELECT * FROM tickets"
        // use await to wait for the result and get the rows
        const {rows} =  await pool.query(q)
        // send back the result
        res.send(rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Can't proceed further at the moment."})
    }
}

export const UpdateTicket = async (req:Request, res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        res.status(422).json({error:firstError})
        return
    }
    const {id} = req.params
    const {title,price} = req.body
    const input = id.trim()
    if(isNaN(Number(input))) {
        res.status(422).json({error: "Invalid input: expected an integer"})
        return
    }
   try {
            // retrive the ticket query
            const q = "SELECT * from tickets WHERE id = $1"
            // Use await to wait for the result of the query, ensures that the query is executed and completes before proceeding.
            const {rows} = await pool.query(q,[id])
            if (rows.length === 0){
                res.status(404).json({error: "Ticket not found"})
                return
            }
   
            if (rows[0].user_id !== req.user?.id){
                res.status(403).json({error: "You're not authorized"})
                return
            }
            // update the ticket query
            let updateQuery = "UPDATE tickets SET "
            const updateParams:any[] = []
            let paramIndex = 1

            if(title){
                updateQuery += `title = $${paramIndex}, `
                updateParams.push(title)
                paramIndex++
            }

            if(price){
                updateQuery += `price = $${paramIndex}, `
                updateParams.push(price)
                paramIndex++
            }

            if(updateParams.length === 0){
                 res.status(200).send({msg: "No changes made at the moment"})
                 return
            }

            let version = rows[0].version
            version++
            updateQuery += `version = $${paramIndex}, `
            updateParams.push(version)
            paramIndex++

            // Remove the trailing comma and space from the update query
            updateQuery = updateQuery.slice(0,-2);

            updateQuery += ' WHERE id = $' + paramIndex
            updateParams.push(id)
            updateQuery += ' RETURNING *'
     
            const {rows : updatedRows} = await pool.query(updateQuery,updateParams);
            const updatedTicket = updatedRows[0]

            await new TicketUpdatedPublisher(natsWrapper.client).publish({
                id:updatedTicket.id,
                title:updatedTicket.title,
                price:updatedTicket.price,
                user_id:updatedTicket.user_id,
                version
            })
            res.send(updatedTicket);
            return;

   } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
    return;
   }

    }