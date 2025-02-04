"use client"
import React, {createContext, useContext, useEffect, useState} from 'react'
import { useQuery, useMutation } from 'react-query';
import { useForm } from "react-hook-form";
import { AuthContextProps, LoginFormData, ResetPassProps, SignupFormData } from '../../types';
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
            
            const res = await postAPI('users/signin', data);
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
            const res = await postAPI('users/signup',data);
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

      // Verify email Mutation
  const getVerify = useMutation(async (token:string) => {
    try{
    const res = await postAPI('users/activate',{token})
    return res.data
  }catch(error:any){
    toast.error(error.response?.data?.error,{id:'email'});
    throw error
  }
    },
    {
      onSuccess: (data) => {
       
        toast.success(data.msg,{id:"email"})
        setTimeout(() => {
            router.push('/login')
        }, 2000);
      },
      onError: (error) => {
        toast.error("Email verification failed",{id:"email"})
        console.error('Verify Email error:', error);
      }
    }
  )

  // Forgot Password Mutation
  const sendPass = useMutation(
    async (forgotEmail:string) => {
      try {

        const res = await postAPI('users/forgot-password', { forgotEmail });
        return res.data;
      } catch (error:any) {
        toast.error(error.response?.data?.error, { id: "fpass" });
        throw error; // Re-throw the error to allow for proper error handling
      }
    },
    {
      onMutate: () => {
        toast.loading("Submitting...", { id: "fpass" });
      },
      onSuccess: (data) => {
        toast.success(data.msg, { id: "fpass" });
      },
      onError: (error) => {
        toast.error('Unable to proceed at the moment ', { id: "fpass" });
        console.error('Forgot Pass error:', error);

      },
    }
  );
  
  // Reset Password

  const resetPass = useMutation(
    async (data:ResetPassProps) => {
      const { password,token } = data;
  
      try{
      const res = await postAPI('users/reset-password', {
        password: password,
        token: token,
      });
      return res.data;
    }catch(error:any){
      toast.error(error.response?.data?.error,{id:'reset'});
      console.error('Reset Pass error:', error);
    }
    },
    {
      onMutate: () => {
        toast.loading('Resetting...', {
          id: 'reset',
        });
      },
      onSuccess: (data) => {
        toast.success(data.msg, {
          id: 'reset',
        });
        setTimeout(() => {
          toast.loading('Redirecting to login...', {
            id: 'reset',
          });
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }, 2000);
      },
      onError: (error) => {
        toast.error('Unable to proceed at the moment',{id:'reset'});
          console.log(error)
      },
    }
  );
    return (
       <AuthContext.Provider value={{login, signup, getVerify, sendPass, resetPass}}>
        {children}
       </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if(!context) throw Error ("useAuthContext must be used within an AuthContextProvider");
  return context;
}
