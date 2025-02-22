import express from 'express'
import { verifyToken } from "@xgettickets/common"
import { CreateTicket, GetTicket } from '../controller/tickets'
import { validateCreateTicket } from '../middlewares/validators'
const router = express.Router()

router.post('/',verifyToken,validateCreateTicket, CreateTicket )
router.get('/:id', GetTicket)

export default router