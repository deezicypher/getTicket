import express from 'express'
import { validSignup } from '../middlewares/validators'

const router = express.Router()

router.get('/api/users/currentuser', (req,res)=>{
    res.send("Hi There!!")
})
router.post('/api/users/signup',validSignup, )
router.post('/api/users/signin', (req,res)=>{
    res.send("Sign in!!")
})
router.post('/api/users/signout', (req,res)=>{
    res.send("Sign out!!")
})

export default router