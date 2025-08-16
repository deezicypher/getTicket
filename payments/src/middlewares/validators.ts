import { check } from "express-validator";
import { RequestHandler } from "express";

export const validatePostPayment:RequestHandler [] = [
    check('token','Token is required').notEmpty(),
    check('orderId').notEmpty()

]