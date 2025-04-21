
import React, {createContext, useContext, useEffect, useState} from 'react'
import {  useMutation } from '@tanstack/react-query';
import { AuthContextProps, LoginFormData, ResetPassProps, SignupFormData } from '../types';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { getAPI, postAPI } from '../utils/fetchData';
import Cookies from 'js-cookie'


const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthContextProvider = ({children}:{children:React.ReactNode}) => {
      const navigate = useNavigate()
      const [user, setUser] = useState<Record<string,unknown>>({})
      

  
    const login = useMutation({
        mutationFn: async (data: LoginFormData) => {
       
            const res = await postAPI('users/signin', data);
            return res.data;
     
        },
          onSuccess: async (data) => {
            setUser(data.user)
                return navigate('/app')
            
          },
          onError: (error: any) => {
            error.response?.data?.error && toast.error(error.response?.data?.error);
            console.error('Login error:', error);
          },
        },
      );

      const signup = useMutation({
         mutationFn: async (data : SignupFormData) => {
 
            const res = await postAPI('users/signup',data);
            return res.data
   
        },
          onSuccess: async (data:any) => {
            Cookies.set('regdata', JSON.stringify(data));
          },
          onError: async (err:any) => {
            err.response.data.error && toast.error(err.response.data.error)
            console.error('Signup error:', err);
          }
        }
      )

      // Verify email Mutation
  const getVerify = useMutation({ 
    mutationFn: async (token:string) => {
     
    const res = await postAPI('users/activate',{token})
    return res.data
     } ,
      onSuccess: async (data) => {
       
        toast.success(data.msg,{id:"email"})
        await navigate('/signin')

      },
      onError: (error:any) => {
        toast.error(error.response?.data?.error,{id:"email"})
        console.error('Verify Email error:', error);
      },
      retry:false
    }
  
  )

  // Forgot Password Mutation
  const sendPass = useMutation({
    mutationFn: async (forgotEmail:string) => {
 

        const res = await postAPI('users/forgot-password', { email:forgotEmail });
        return res.data;
 
    },
      onMutate: () => {
        toast.loading("Submitting...", { id: "fpass" });
      },
      onSuccess: (data) => {
        toast.success(data.msg, { id: "fpass" });
      },
      onError: (error:any) => {
        toast.error(error.response?.data?.error, { id: "fpass" });
        console.error('Forgot Pass error:', error);

      },
    }
  );
  
  // Reset Password

  const resetPass = useMutation({
    mutationFn: async (data:ResetPassProps) => {
      const { password,token } = data;

      const res = await postAPI('users/reset-password', {
        password: password,
        token: token,
      });
      return res.data;

    },
    
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
            navigate('/signin');
          }, 2000);
        }, 2000);
      },
      onError: (error:any) => {
        toast.error(error.response?.data?.error,{id:'reset'});
          console.log(error)
      },
    }
  );

  const logout = useMutation({
    mutationFn: async () => {
      const res = await postAPI('users/signout')
      return res.data
    },
    onSuccess: (data) => {
      Cookies.remove('regdata')
      setUser({})
      toast.success(data.msg)
      navigate('/')
    },
    onError:(error) => {
      console.log(error)
    }
  })


  const authCheckState = useMutation({
    mutationFn: async() => {
      const res = await getAPI('users/currentuser')
      return res.data
    },
    onSuccess:(data)=>{
      setUser(data.user)
    },
    onError:(error:any) => {
      console.log(error)
    }
  })
  
  useEffect(() => {
    authCheckState.mutate();
  }, []);

    return (
       <AuthContext.Provider value={{
        login, signup, getVerify, sendPass, resetPass, user, setUser,logout
        }}>
        {children}
       </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if(!context) throw Error ("useAuthContext must be used within an AuthContextProvider");
  return context;
}
