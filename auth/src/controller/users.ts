import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt'
import pool from "../config/db";
import { generateActiveToken } from "../utils/generateToken";
import sendEmail from "../utils/sendMail";


const CLIENT_URL = `${process.env.CLIENT_URL}`


export const signup = async  (req:Request, res:Response) => (req:Request,res:Response)=>{
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
            /*
             const saveq = "INSERT INTO USERS (`name`,`email`,`password`) VALUES (?,?,?)"
            pool.query(saveq,[name,email,hashedPass],(err:any, user:any) => {
              if (err) {
                console.error("Error executing saveq query:", err);
                return res.status(500).json({ error: "Unable to proceed further at the moment " });
              }
            })*/
            
}catch(err){
  console.log(err)
  res.status(500).json(err)
  return
}
}

