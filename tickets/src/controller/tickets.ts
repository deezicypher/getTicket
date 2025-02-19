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
    const normalizedTitle = title.toLowerCase().trim

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