"use client"
import React, {createContext, useContext, useEffect, useState} from 'react'
import { useQuery, useMutation } from 'react-query';
import { useForm } from "react-hook-form";
import { AuthContextProps, LoginFormData } from '../../types';
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation';



const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthContextProvider = ({children}:{children:React.ReactNode}) => {
      const router = useRouter()

    
    const login = useMutation(
        async (data: LoginFormData) => {
          try {
            console.log(data)
            //const res = await postAPI('users/login', data);
            //return res.data;
          } catch (error: any) {
            error.response?.data?.error && toast.error(error.response?.data?.error);
            console.error('Login error:', error);
          }
        },
        {
          onSuccess: async (data: any) => {
                return router.push('/app')
            
          },
          onError: (error: any) => {
            console.error('Login error:', error);
          },
        },
      );

    return (
       <AuthContext.Provider value={{login}}>
        {children}
       </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if(!context) throw Error ("useAuthContext must be used within an AuthContextProvider");
  return context;
}
