import express,{Request,Response} from 'express'
import { validSignup } from '../middlewares/validators'
import { validationResult } from 'express-validator'

const router = express.Router()

router.get('/api/users/currentuser', (req,res)=>{
    res.send("Hi There!!")
})
router.post('/api/users/signup',validSignup, (req:Request,res:Response)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
    res.status(422).json({
          error: firstError
        });
        return;
      }  
    const {email, password} = req.body

    console.log('Creating a user...')
    
    res.send({})
})
router.post('/api/users/signin', (req,res)=>{
    res.send("Sign in!!")
})
router.post('/api/users/signout', (req,res)=>{
    res.send("Sign out!!")
})

export default router