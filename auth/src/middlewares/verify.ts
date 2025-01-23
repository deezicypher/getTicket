import { Response , Request, NextFunction} from 'express';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { ReqAuth } from '../types'
dotenv.config()

export const verifyToken = (req:ReqAuth, res:Response, next:NextFunction):void => {
  
    const token = req.cookies.accesstoken;
    if(!token) {
    res.status(401).json({msg:"You're not authenticated"})
    return
    }

    jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err: any, user:any) => {
      if (err) {

        console.log(token, err)
        return res.status(403).json({error:'Token is not valid'});
      }
      req.user = user;
    
      next();
    });
}

export const verifyUser = (req:ReqAuth, res:Response, next:NextFunction) => {
  verifyToken(req, res,() => {
   
      if(req.user?.id === req.query.id || req.user?.role === "ADMIN"){
          next()
      }else{
        return res.json(403).json("You're not authorized")
      }
  })
}



export const verifyAdmin = (req:ReqAuth, res:Response, next:NextFunction) => {
    verifyToken(req, res,() => {
        if(req.user?.role === "ADMIN") return next()
        else return res.json(403).json("You're not an administrator")
    })
}