import { UseMutationResult } from "react-query";

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean
  }
  
export interface SignupFormData {
    [key:string]:any
}

export interface verifyProps {
    [key:string]:any
}
export interface ResetPassProps {
    password:string,
    password2:string,
    token:string
}

export interface AuthContextProps {
    login: UseMutationResult<any,LoginFormData,unknown>,
    signup: UseMutationResult<any,SignupFormData,unknown>,
    getVerify: UseMutationResult<string>,
    sendPass: UseMutationResult<string>,
    resetPass: UseMutationResult<ResetPassProps>
}