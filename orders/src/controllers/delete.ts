import {Request, Response} from 'express'
import { validationResult } from 'express-validator'
import pool from '../config/db'

const DeleteOrder = async(req:Request, res:Response) => {
    const {id} = req.params
   const errors = validationResult(req)
   if(!errors.isEmpty()){
    const firstError = errors.array().map(err => err.msg)[0]
    res.status(422).json({error:firstError})
    return
   }
 
   try {
    const q = "SELECT * FROM orders WHERE id = $1"
    const {rows} = await pool.query(q,[id])
 
    if(rows.length === 0){
        res.status(404).json({error:"Order not found"})
        return
    }
    if(rows[0].user_id !== req.user?.id){
        res.status(401).json({error:"Unauthorized access"})
        return
    }
    const uq = "UPDATE orders SET status = 'cancelled' WHERE id = $1 RETURNING *"
    const {rows:updatedorder} = await pool.query(uq,[id])
   
    res.status(200).send(updatedorder[0])
    return
   } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
        return
   }
}

export default DeleteOrder