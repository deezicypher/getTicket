import  {Request, Response} from 'express'
import pool from '../config/db'

const ShowIndex = async (req:Request, res:Response) => {
    const q = `
    SELECT * , 
    json_build_object(
        'id',t.id,
        'title', t.title,
        'price', t.price
    ) AS ticket
     FROM orders o LEFT JOIN tickets t ON t.id = o.ticket_id
     WHERE user_id = $1
     ORDER BY o.created_at DESC
     `
    const {rows} =  await pool.query(q,[req.user?.id])
    res.send(rows)
    return
}

export default ShowIndex