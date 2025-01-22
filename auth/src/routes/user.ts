import express from 'express'
import { forgotPasswordValidator, resetPasswordValidator, validLogin, validSignup } from '../middlewares/validators'
import { ResetPassword, activateaccount, forgetPassword, logout, refreshTokenEndpoint, signin, signup } from '../controller/users'

const router = express.Router()

router.get('/api/users/currentuser', (req,res)=>{
    res.send("Hi There!!")
})
router.post('/api/users/signup',validSignup,signup)
router.post('/api/users/activate', activateaccount)
router.post('/api/users/refresh_token',refreshTokenEndpoint)
router.post('/api/users/signin',validLogin, signin)
router.post('/api/users/forgotpassword',forgotPasswordValidator, forgetPassword)
router.post('/api/users/resetpassword',resetPasswordValidator, ResetPassword)
router.post('/api/users/signout', logout)

export default router