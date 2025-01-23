import { Request } from "express";

export  interface User{
    id:string;
    name:string;
    email:string;
    password:string;
    hashedPass:string;
    role?: string;
}

export interface DecodedToken {
    id?:string;
    user:User;
    iat:number;
    exp:number;
}
export interface ReqAuth extends Request {
    user?: User
  }
  