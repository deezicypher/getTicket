import { check } from "express-validator";
import { RequestHandler } from "express";

export const validateCreateOrder: RequestHandler [] = [
    check('ticketId', 'TicketId is required').notEmpty(),
]