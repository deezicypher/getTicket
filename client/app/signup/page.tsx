'use client'
import React from 'react'
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";
import Link from 'next/link';
import { AuthContextProps, LoginFormData, SignupFormData } from '../../types';
import { useAuthContext } from '../context/authContext';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import EmailSent from './Emailsent/EmailSent';

const page = () => {
  const {signup} = useAuthContext()
  const formSchema = yup.object().shape({
      name: yup.string()
      .required('Enter your full name'),
      email: yup.string()
      .required('Enter your email')
      .email('Enter a valid email'),
      password: yup.string()
      .required('Enter your password')
      .matches(/^\S*$/, 'Whitespace is not allowed')
      .min(6, 'Passoword must be 6 characters long'),
      confirmpassword: yup.string()
      .required('Confirm password')
      .oneOf([yup.ref('password')], 'Password does not match')

  })
  
  const formOptions =  {resolver: yupResolver(formSchema)}
  const { register, handleSubmit, formState: { errors } } = useForm(formOptions);
 

 
  const onSubmit =   (data:SignupFormData) => {
    signup.mutate(data)
  }

  if(signup.data?.msg) return (
    <EmailSent/>
  )


  return (
    <div className="flex flex-col items-center justify-center sm:-mt-20 min-h-screen p-4">
<Image src="/images/gett.png" alt="" width={100} height={100} />
<form className="mt-8 space-y-6 sm:w-100 w-full" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px flex flex-col  gap-5 rounded-md shadow-sm">
        
            <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                {errors.name && <p className='text-red-500 text-[14px] mb-2' role="alert">{errors.name?.message}</p>}
               
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  required
                  className=" w-full bg-transparent  rounded-md border border-gray-300 px-3 py-2  focus:outline-none  sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
       
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                {errors.email && <p className='text-red-500 text-[14px] mb-2' role="alert">{errors.email?.message}</p>}
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
        
                  required
                 className=" w-full bg-transparent  rounded-md border border-gray-300 px-3 py-2  focus:outline-none  sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            
          
           
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                {errors.password && <p className='text-red-500 text-[14px] mb-2' role="alert">{errors.password?.message}</p>}
               
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...register('password')}
                  className=" w-full bg-transparent  rounded-md border border-gray-300 px-3 py-2  focus:outline-none  sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="confirmpassword" className="sr-only">
                  Confirm Password
                </label>
                {errors.confirmpassword && <p className='text-red-500 text-[14px] mb-2' role="alert">{errors.confirmpassword?.message}</p>}
               
                <input
                  id="confirmpassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...register('confirmpassword')}
                  className=" w-full bg-transparent  rounded-md border border-gray-300 px-3 py-2  focus:outline-none  sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
           

       

        

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md  bg-gradient-to-r from-[#408ffe] to-[#1764f4]   py-2 px-4  font-medium text-white text-base font-poppins focus:outline-none "
              >
                {signup.isLoading? (<Image src='/images/loader.svg' alt=""  width={30} height={30} />)
                :
                <>
             
                Sign up
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
</svg>

                </span>
                </>
}
              </button>
            </div>

            <p className="mt-2 text-center text-sm text-slate-600">
              Return to {' '}
              <Link href="/login" className="font-medium bg-gradient-to-r from-[#f66830] to-[#fe5340] text-transparent bg-clip-text">
                Login
              </Link>
            </p>
          </form>
    </div>
  )
}

export default page