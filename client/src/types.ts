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
    authCheckState: UseMutationResult<any, Error, void, unknown>;
    getUserLoading:boolean;
}

// Ticket

export interface TicketInputs{
    title: string;
    price: number;
}

export interface TicketContextProps {
    createTicket: UseMutationResult<any, any, TicketInputs, unknown>; 
    getTickets:  UseMutationResult<any, Error,  string | undefined, unknown>;
    tickets: Record<string, any>;
    getTicket:  UseMutationResult<any, Error, string | undefined, unknown>;
    ticket: Record<string, any>;
    ticketLoading: boolean;
    searchTicket:  UseMutationResult<Record<string, any>[], Error, string, unknown>;
    searchedTicket: Record<string, any>;
    setSearchedTicket: Dispatch<SetStateAction<Record<string, any>[]>>;

}

// Orders

export interface OrderContextProps {
    order: Record<string, any>;
    postOrder:UseMutationResult<any, Error, string | undefined, unknown>;
    getOrder: UseMutationResult<any, Error, string | undefined, unknown>;
    postPayment:UseMutationResult<any, any, { token: string; orderId: string; }, unknown>;
    orders: Record<string, any>;
    getOrders: UseMutationResult<any, Error, void, unknown>;
}