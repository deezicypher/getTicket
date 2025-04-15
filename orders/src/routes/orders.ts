import express,{ Router } from "express";
import ShowIndex from "../controllers";
import DeleteOrder from "../controllers/delete";
import NewOrder from "../controllers/new";
import ShowOrder from "../controllers/show";

const router = Router()
router.get('', ShowIndex)
router.delete('/:id', DeleteOrder)
router.post('', NewOrder)
router.get('/:id',ShowOrder)

export default router