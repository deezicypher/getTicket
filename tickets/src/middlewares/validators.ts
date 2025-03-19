import { check } from "express-validator";
import { RequestHandler } from "express";

export const validateCreateTicket: RequestHandler [] = [
    check('title', 'Title is required').notEmpty(),
    check('price').isFloat({gt:0}).withMessage('Price must be greater than 0')

]

export const validateUpdateTicket: RequestHandler [] = [
    check('price')
    .optional()
    .isFloat({gt:0})
    .withMessage('Price must be greater than 0')
]