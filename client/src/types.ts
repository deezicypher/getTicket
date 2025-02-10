import { UseMutationResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
  }
  
export interface SignupFormData {
    [key:string]:any
}

export interface verifyProps {
    [key:string]:any
}
export interface ResetPassProps {
    password:string;
    password2:string;
    token?:string;
}

export interface User{
    [key:string] : any
}

export interface AuthContextProps {
    login: UseMutationResult<any,any,LoginFormData,unknown>;
    signup: UseMutationResult<any,any,SignupFormData,unknown>;
    getVerify: UseMutationResult<any, any,string,unknown>;
    sendPass: UseMutationResult<any, any,string,unknown>;
    resetPass: UseMutationResult<any, any, ResetPassProps, void>;
    user:User;
    setUser:Dispatch<SetStateAction<User>>;
    logout: UseMutationResult<any, Error, void, unknown>;
}