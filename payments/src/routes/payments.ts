import { verifyToken } from '@xgettickets/common'
import express, {Router} from 'express'
import { validatePostPayment } from '../middlewares/validators'
import { postPayment } from '../controllers/new'

const router = Router()

router.post('',verifyToken,validatePostPayment, postPayment)


export default router