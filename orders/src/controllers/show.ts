import  {Request, Response} from 'express'
import { validationResult } from 'express-validator'
import pool from '../config/db'

const ShowOrder = async (req:Request, res:Response) => {
    const {id} = req.params
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const firstError = errors.array().map(err => err.msg)[0]
        res.status(422).json({error:firstError})
        return
    }

    try{
        const q = `SELECT o.*,
            json_build_object(
        'id',t.id,
        'title', t.title,
        'price', t.price
    ) AS ticket
        FROM orders o LEFT JOIN tickets t on t.id = o.ticket_id 
        WHERE o.id = $1
        ORDER BY o.created_at DESC
        `
       
        const {rows} = await pool.query(q,[id])

        if(rows.length === 0){
            res.status(404).json({error: "Order not found"})
            return
        }
        const result = rows[0]
        if(result.user_id !== req.user?.id){
            res.status(401).json({error: "unauthorized access"})
            return
        }
        res.send(result)
        return
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'})
        return
    }

}

export default ShowOrder