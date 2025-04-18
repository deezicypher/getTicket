import  {Request, Response} from 'express'
import { validationResult } from 'express-validator'
import pool from '../config/db'

const ShowOrder = async (req:Request, res:Response) => {
    const {id} = req.params
    const firstError = validationResult(req)
    if(!firstError.isEmpty()){
        const error = firstError.array().map(err => err.msg)[0]
        res.status(422).json({error:error})
        return
    }

    try{
        const q = 'SELECT * FROM orders WHERE id = $1'
       
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