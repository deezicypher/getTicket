import { Response ,Request,  NextFunction} from 'express';
import jwt from 'jsonwebtoken'

export  interface User{
  id:string;
  name:string;
  email:string;
  password:string;
  hashedPass:string;
  role?: string;
}
declare global{
  namespace Express {
      interface Request {
          user?: User
      }
  }
}


export const verifyToken = (req:Request, res:Response, next:NextFunction):void => {
  
    const token = req.session?.accesstoken;
    if(!token) {
    res.status(401).json({msg:"You're not authenticated"})
    return
    }

    jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err: any, user:any) => {
      if (err) {

        return res.status(403).json({error:'Token is not valid'});
      }
      req.user = user;
    
      next();
    });
}

export const verifyUser = (req:Request, res:Response, next:NextFunction) => {
  verifyToken(req, res,() => {
   
      if(req.user?.id === req.query.id){
          next()
      }else{
        return res.status(403).json("You're not authorized")
      }
  })
}



export const verifyAdmin = (req:Request, res:Response, next:NextFunction) => {
    verifyToken(req, res,() => {
        if(req.user?.role === "ADMIN") return next()
        else return res.status(403).json("You're not an administrator")
    })
}