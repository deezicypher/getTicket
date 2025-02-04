"use client"
import React, {createContext, useContext, useEffect, useState} from 'react'
import { useQuery, useMutation } from 'react-query';
import { useForm } from "react-hook-form";
import { AuthContextProps, LoginFormData, SignupFormData } from '../../types';
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation';
import { postAPI } from '../../utils/fetchData';
import Cookies from 'js-cookie'


const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthContextProvider = ({children}:{children:React.ReactNode}) => {
      const router = useRouter()

    
    const login = useMutation(
        async (data: LoginFormData) => {
          try {
            
            const res = await postAPI('/api/users/signin', data);
            return res.data;
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

      const signup = useMutation(
        async (data : SignupFormData) => {
          try{
            const res = await postAPI('api/users/signup',data);
            return res.data
          }catch(err:any){
            err.response.data.error && toast.error(err.response.data.error)
            console.log('Signup error:', err)
          }
        },{
          onSuccess: async (data:any) => {
            Cookies.set('regdata', JSON.stringify(data));
          },
          onError: async (error:any) => {
            console.error('Signup error:', error);
          }
        }
      )
    return (
       <AuthContext.Provider value={{login, signup}}>
        {children}
       </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if(!context) throw Error ("useAuthContext must be used within an AuthContextProvider");
  return context;
}
