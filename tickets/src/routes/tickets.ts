import express from 'express'
import { verifyToken } from "@xgettickets/common"
import { CreateTicket, GetTicket, GetTickets, UpdateTicket } from '../controller/tickets'
import { validateCreateTicket, validateUpdateTicket } from '../middlewares/validators'
const router = express.Router()

router.post('/',verifyToken,validateCreateTicket, CreateTicket )
router.get('/:id', GetTicket)
router.get('/', GetTickets)
router.put('/:id', verifyToken,validateUpdateTicket, UpdateTicket)

export default router


