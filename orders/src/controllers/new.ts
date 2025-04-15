import  {Request, Response} from 'express'
import { validationResult } from 'express-validator'

const NewOrder = (req:Request, res:Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const firstError = errors.array().map(err => err.msg)[0]
        res.status(422).json({error:firstError})
        return
    }

    res.send({})
}

export default NewOrder