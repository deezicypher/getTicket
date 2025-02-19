import express from 'express'
import { verifyToken } from "@xgettickets/common"
import { CreateTicket } from '../controller/tickets'
import { validateCreateTicket } from '../middlewares/validators'
const router = express.Router()

router.post('',verifyToken,validateCreateTicket, CreateTicket )

export default router