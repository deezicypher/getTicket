import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt'
import pool from "../config/db";
import { generateAccessToken, generateActiveToken, generateRefreshToken } from "../utils/generateToken";
import sendEmail, { ResetPass } from "../utils/sendMail";
import { DecodedToken } from "../types";
import Jwt  from "jsonwebtoken";

const CLIENT_URL = `${process.env.CLIENT_URL}`


export const signup = async (req:Request,res:Response)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
    res.status(422).json({
          error: firstError
        });
        return;
      }  
    const {name,email, password} = req.body

    try {


        const q =  "SELECT * FROM users WHERE email = ? or name = ? "
        pool.query(q,[email.toLowerCase(), name.toLowerCase()],(err:any, user:any) => {
            if (err) {
                console.error("Error executing check user exists query:", err);
                return res.status(500).json({ error: "Internal server error" });
              }

            if (user.length > 0) {
                if (user[0].email === email) {
                  return res.status(400).json({ error: "Email already exists" });
                }
                if (user[0].username === name) {
                  return res.status(400).json({ error: "Name already exists" });
                }
            
              }
            })
            const salt = bcrypt.genSaltSync(10)
            const hashedPass = bcrypt.hashSync(password, salt)

            const user = {name,email,hashedPass}
            const active_token = generateActiveToken(user)
            const url = `${CLIENT_URL}/verify?token=${active_token}`
       

            sendEmail(email, url,  "Verify your email address", res, email)
            
            
}catch(err:any){
  console.log(err)
  res.status(500).json({error: err.message})
  return
}
}

export const activateaccount = async (req:Request, res:Response) => {
  try{


  const {token} = req.body
  
  let decoded: DecodedToken;

  try {
    //This tells TypeScript that the result of jwt.verify() should be treated as type DecodedToken
    decoded = <DecodedToken>Jwt.verify(token,`${process.env.ACTIVE_TOKEN_SECRET}`);
  } catch (error) {
    res.status(401).json({error: 'Invalid or expired token'})
    return
  }
  const { user } = decoded
  if (!user) {
    res.status(400).json({error: "Invalid Authentication"})
    return
  }

  const {name,email,hashedPass} = user
  
             const saveq = "INSERT INTO USERS (`name`,`email`,`password`) VALUES (?,?,?)"
            pool.query(saveq,[name,email,hashedPass],(err:any, user:any) => {
              if (err) {
                console.error("Error executing saveq query:", err);
                return res.status(500).json({ error: "Unable to proceed further at the moment " });
              }
              res.json({msg: "Account has been activated!", user:user[0]})
              return
            })
          }catch(err){
            console.log(err)
            res.status(500).json({error:"Email may already be verified, or link is broken"})
            return
          }
}

export const refreshTokenEndpoint = async (req: Request, res: Response) => {
  try {
      // Get refresh token from cookie
      const refresh_token = req.cookies.refresh_token;
      
      if(!refresh_token) {
         res.status(401).json({error: "Please login"});
      return
        }
      
      // Verify refresh token
      const decoded = <DecodedToken>Jwt.verify(refresh_token, `${process.env.REFRESH_TOKEN_SECRET}`);
      
      // Generate new access token
      const access_token = generateAccessToken({id: decoded.id}, res);
      
      res.json({ access_token });
  } catch(err:any){
    console.log(err)
    res.status(500).json({error: err.message})
      return
  }
}

export const resendEmail = async  (req:Request, res:Response) => (req:Request,res:Response)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
  res.status(422).json({
        error: firstError
      });
      return;
    }  
  const {name,email, password} = req.body

  try {


      const q =  "SELECT * FROM users WHERE email = ? or name = ? "
      pool.query(q,[email.toLowerCase(), name.toLowerCase()],(err:any, user:any) => {
          if (err) {
              console.error("Error executing check user exists query:", err);
              return res.status(500).json({ error: "Internal server error" });
            }

          if (user.length > 0) {
              if (user[0].email === email) {
                return res.status(400).json({ error: "Email already exists" });
              }
              if (user[0].username === name) {
                return res.status(400).json({ error: "Name already exists" });
              }
          
            }
          })
          const salt = bcrypt.genSaltSync(10)
          const hashedPass = bcrypt.hashSync(password, salt)

          const user = {name,email,hashedPass}
          const active_token = generateActiveToken(user)
          const url = `${CLIENT_URL}/verify?token=${active_token}`
     

          sendEmail(email, url,  "Verify your email address", res, email)
          
          
} catch(err:any){
    console.log(err)
    res.status(500).json({error: err.message})
    return
}
}

export const signin =(req:Request, res:Response) => {
  const {email,password} = req.body
  const errors = validationResult(req);

   

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    res.status(422).json({
      error: firstError,
    });
    return;
  }
  try{
    const q = "SELECT * FROM users WHERE email = ?"
    pool.query(q,[email],  (err:any,user:any)=>{
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if(user.length === 0) return res.status(400).json({error:"Invalid Email"})

      const checkPassword = bcrypt.compare(password,user[0].password)
      if(!checkPassword) return res.status(404).json({error: "Invalid Password"})
      const access_token = generateAccessToken({id:user[0].id},res)
    const refresh_token = generateRefreshToken({id:user[0].id}, res)

    return res.cookie('accesstoken',access_token,{httpOnly:true}).json({
      user: { id:user[0]?.id,access_token,name:user[0]?.name,email:user[0]?.email,}
    })

    })
  } catch(err:any){
    console.log(err)
    res.status(500).json({error: err.message})
    return
  }
}

export const forgetPassword = async (req:Request, res:Response):Promise<void> => {
  const {email} = req.body;
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    const firstError = errors.array().map(err => err.msg)[0]
    res.status(422).json({error:firstError})
    return;
  }
try{
  const q = "SELECT * FROM users WHERE email = ?"
  pool.query(q,[email],(err:any, user:any) => {
    if(err){
      console.log(err)
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (user.length === 0 ) return res.status(404).json({error: "Account not found"})
      const active_token = generateActiveToken({id:user[0].id})
    const url = `${CLIENT_URL}/resetpassword/${active_token}`
    ResetPass(email,url,"Reset Password",res, email)

    }
  })
}catch(err:any){
  console.log(err)
  res.status(500).json({error: err.message})
  return
}
}

export const ResetPassword = async (req:Request, res:Response) => {
  try{
    const {token,password} = req.body
    let decoded : DecodedToken;

      decoded = <DecodedToken>Jwt.verify(token,`${process.env.ACTIVE_TOKEN_SECRET}`)
 
    const {id} = decoded
    if(!id) {
      res.status(401).json({error: "Invalid Authentication"})
      return;
    } 

    const salt = bcrypt.genSaltSync(10)
    const hashedPass = bcrypt.hashSync(password, salt)

    const q = 'UPDATE users SET password = ? WHERE id = ? '

    pool.query(q,[hashedPass,id], (err:any, user:any)=>{
      if(err) return console.log(err)
      res.json({msg: "Password Reset Successful"})
    })
  }catch(err:any) {
    console.log(err)
    res.status(500).json({error: err.message})
    return
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
      // Clear cookies
      res.clearCookie('accesstoken');
      res.clearCookie('refresh_token');
      res.json({ msg: "Logged out successfully" });
      return
  } catch(err:any) {
      res.status(500).json({ error: err.message });
      return 
  }
};
