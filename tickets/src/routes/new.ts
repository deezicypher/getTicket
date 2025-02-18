import express, {Request, Response} from 'express'
import { verifyToken } from "@xgettickets/common"
const router = express.Router()

router.post('',verifyToken, (req:Request, res:Response) => {
    res.sendStatus(200)
})

export default router