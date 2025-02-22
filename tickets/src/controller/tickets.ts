import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../config/db";

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
    const result = await pool.query(q,[normalizedTitle,price,id])

    res.status(201).send(result)
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
        res.status(200).send(result)

    }catch(err) {
        console.log(err)
        res.status(500).json({error: "Can't proceed further at the moment."})
    }
}