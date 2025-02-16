import express from 'express'
import { forgotPasswordValidator, resetPasswordValidator, validLogin, validSignup } from '../middlewares/validators'
import { ResetPassword, activateaccount, currentUser,  forgetPassword, logout, refreshTokenEndpoint, resendEmail, signin, signup } from '../controller/users'
import { verifyToken } from '@xgettickets/common'

const router = express.Router()

router.get('/currentuser', verifyToken, currentUser)
router.post('/signup',validSignup,signup)
router.post('/activate', activateaccount)
router.post('/resend-email',validSignup,resendEmail)
router.post('/refresh_token',refreshTokenEndpoint)
router.post('/signin',validLogin, signin)
router.post('/forgotpassword',forgotPasswordValidator, forgetPassword)
router.post('/resetpassword',resetPasswordValidator, ResetPassword)
router.post('/signout', logout)

export default router