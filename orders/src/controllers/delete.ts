import {Request, Response} from 'express'
import { validationResult } from 'express-validator'
import pool from '../config/db'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'


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
    const version = rows[0].version
    const uq = "UPDATE orders SET version = version + 1, status = 'cancelled' WHERE id = $1 AND version = $2 RETURNING *"
    const {rows:updatedorder} = await pool.query(uq,[id,version])

    if (updatedorder.length === 0) {
        return res.status(409).json({ error: "Conflict: Order was modified by another process" });
      }
      

    //Publishing an event saying an order was cancelled
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id,
        version,
        ticket:{
            id:updatedorder[0].ticket_id
        }
    })

   
    res.status(200).send(updatedorder[0])
    return
   } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
        return
   }
}

export default DeleteOrder