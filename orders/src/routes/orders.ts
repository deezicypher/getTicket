import express,{ Router } from "express";
import { verifyToken } from "@xgettickets/common"
import ShowIndex from "../controllers";
import DeleteOrder from "../controllers/delete";
import NewOrder from "../controllers/new";
import ShowOrder from "../controllers/show";
import { validateCreateOrder } from "../../middlewares/validators";

const router = Router()
router.get('',verifyToken,ShowIndex)
router.delete('/:id',verifyToken,DeleteOrder)
router.post('',verifyToken,validateCreateOrder,NewOrder)
router.get('/:id',verifyToken,ShowOrder)

export default router