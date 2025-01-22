import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt'
import pool from "../config/db";
import { generateAccessToken, generateActiveToken, generateRefreshToken } from "../utils/generateToken";
import sendEmail, { ResetPass } from "../utils/sendMail";
import { DecodedToken } from "../types";
import Jwt  from "jsonwebtoken";

const CLIENT_URL = `${process.env.CLIENT_URL}`


export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    res.status(422).json({ error: firstError });
    return 
  }

  const { name, email, password } = req.body;

  try {
    // Check if the email or name already exists in the database
    const query = "SELECT * FROM users WHERE email = $1 OR name = $2";
    // Use await to wait for the result of the query, ensures that the query is executed and completes before proceeding.
    const { rows } = await pool.query(query, [email.toLowerCase(), name.toLowerCase()]);

    // If user is found, check if the email or name already exists
    if (rows.length > 0) {
      const user = rows[0];
      
      if (user.email === email) {
         res.status(400).json({ error: "Email already exists" });
         return
      }

      if (user.name === name) {
         res.status(400).json({ error: "Name already exists" });
         return
      }
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    // Create a new user object (without the password plain text)
    const newUser = { name, email, password: hashedPass };

// Generate an activation token for the user
    const active_token = generateActiveToken({ user: newUser });
    const url = `${CLIENT_URL}/verify?token=${active_token}`;

    // Send a confirmation email 
    sendEmail(email, url, "Verify your email address", res, email);

  
    
  } catch (err: any) {
    console.error(err);
   res.status(500).json({ error: err.message });
   return 
  }
};

export const activateaccount = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    
    let decoded: DecodedToken;

    try {
      decoded = <DecodedToken>Jwt.verify(token, `${process.env.ACTIVE_TOKEN_SECRET}`);
    } catch (error) {
       res.status(401).json({ error: 'Invalid or expired token' });
       return
    }

    // Check if the user is present in the decoded token
    const { user } = decoded;

    if (!user) {
       res.status(400).json({ error: 'Invalid Authentication' });
       return
    }

    const { name, email, hashedPass } = user;

    // Prepare the query to save the user in the database
    const saveQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';

    // Use await to run the query and handle the response
    const result = await pool.query(saveQuery, [name, email, hashedPass]);

    // Respond with a success message and the created user
   res.json({ msg: 'Account has been activated!', user: result.rows[0] });
   return

  } catch (err) {
    // Catch any error that happens during the process
    console.error(err);
 res.status(500).json({ error: 'Email may already be verified, or the link is broken' });
 return 
  }
};

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

export const resendEmail = async  (req:Request, res:Response) => {
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
    // check if the email or name exists
    const q =  "SELECT * FROM users WHERE email = $1  "
    
    // use await to wait for the result of the query
    const {rows} = await pool.query(q,[email.toLowerCase()])
// if user is found, check if the email  exits
    if(rows.length > 0) {
    const user = rows[0]
    if (user.email === email) {
      res.status(400).json({ error: "Email already exists" });
      return
   }
    }
  // Hash the password
          const salt = bcrypt.genSaltSync(10)
          const hashedPass = bcrypt.hashSync(password, salt)

          // create a user object
          const user = {name,email,hashedPass}

          // create activation token with the user object
          const active_token = generateActiveToken({user})

          // generate activation url
          const url = `${CLIENT_URL}/verify?token=${active_token}`
     
    // send verification email
          sendEmail(email, url,  "Verify your email address", res, email)
          
          
} catch(err:any){
    console.log(err)
    res.status(500).json({error: err.message})
    return
}
}

export const signin = async (req:Request, res:Response) => {
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
    // check if the user exists
    const q = "SELECT * FROM users WHERE email = $1"

    // use await to wait for the result of the query
    const {rows} = await pool.query(q,[email])


    if(rows.length === 0) {
     res.status(400).json({error:"Invalid Email"})
     return
    }

    const user = rows[0]

    // check and compare password
      const checkPassword = bcrypt.compareSync(password,user.password)
      if(!checkPassword) {
         res.status(404).json({error: "Invalid Password"})
        return
      }
      const access_token = generateAccessToken({id:user.id},res)
    const refresh_token = generateRefreshToken({id:user.id}, res)

     res.cookie('accesstoken',access_token,{httpOnly:true}).json({
      user: { id:user?.id,access_token,name:user?.name,email:user?.email,}
    })
    return
    
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
  // check if user exists
  const q = "SELECT * FROM users WHERE email = $1"

  // use await to wait for the result of the query
  const {rows} = await pool.query(q,[email.toLowerCase()])
  if(rows.length === 0) {
     res.status(404).json({error:"Account not found"})
     return
  }
  const user = rows[0]

  // create active token with user id
  const active_token = generateActiveToken({id:user.id})
  // generate activation url

  const url = `${CLIENT_URL}/resetpassword/${active_token}`
  // Send Email
  ResetPass(email,url,"Reset Password",res, email)

}catch(err:any){
  console.log(err)
  res.status(500).json({error: err.message})
  return
}
}

export const ResetPassword = async (req:Request, res:Response) => {
  try{
    const {token,password} = req.body
    // declare decoded variable of type DecodedToken
    let decoded : DecodedToken;

    // Try to verify token and assign the result to decoded variable
      decoded = <DecodedToken>Jwt.verify(token,`${process.env.ACTIVE_TOKEN_SECRET}`)
 
      // get id from decoded
    const {id} = decoded

    if(!id) {
      res.status(401).json({error: "Invalid Authentication"})
      return;
    } 

    //Hash the password
    const salt = bcrypt.genSaltSync(10)
    const hashedPass = bcrypt.hashSync(password, salt)

    //Update user password query
    const q = 'UPDATE users SET password = $1 WHERE id = $2 '

    // use await to wait for the result of the query
     await pool.query(q,[hashedPass,id])
     res.json({msg: "Password Reset Successful"})
     return;
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