import  {Request, Response} from 'express'

const ShowIndex = (req:Request, res:Response) => {
    res.send({})
}

export default ShowIndex