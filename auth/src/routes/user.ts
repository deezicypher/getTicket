import express from 'express'
import { validLogin, validSignup } from '../middlewares/validators'
import { activateaccount, refreshTokenEndpoint, signin, signup } from '../controller/users'

const router = express.Router()

router.get('/api/users/currentuser', (req,res)=>{
    res.send("Hi There!!")
})
router.post('/api/users/signup',validSignup,signup)
router.post('/api/users/activate', activateaccount)
router.post('/api/users/refresh_token',refreshTokenEndpoint)
router.post('/api/users/signin',validLogin, signin)
router.post('/api/users/signout', (req,res)=>{
    res.send("Sign out!!")
})

export default router