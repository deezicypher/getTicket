import { Request,Response } from "express";
import { validationResult } from "express-validator";
import pool from "../config/db";
import { OrderStatus } from "@xgettickets/common";
import { stripe } from "../stripe";


export const postPayment = async (req:Request, res:Response ) => {
    const errors = validationResult(req)
   if(!errors.isEmpty()){
        const firstError = errors.array().map(err => err.msg)[0]
        res.status(422).json({error:firstError})
        return
   }

   const {token, orderId} = req.body
   
   const q = "SELECT * FROM orders WHERE id = $1"
   const {rows} = await pool.query(q,[orderId])
   const order = rows[0]

   if (rows.length === 0){
    res.status(404).json({error: "Order not found"})
    return;
    }
    if(order.user_id !== req.user!.id){
        res.status(403).json({error:"You're not authorized"})
        return
    }
    if(order.status === OrderStatus.Cancelled){
        res.status(400).json({error: "Order is cancelled"})
        return
    }

    await stripe.charges.create({
        currency:'usd',
        amount: order.price * 100,
        source: token
    })
   res.send({success:true})
   return
}