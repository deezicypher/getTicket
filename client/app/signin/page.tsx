'use client'
import React from 'react'
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";
import Link from 'next/link';
import { AuthContextProps, LoginFormData } from '../../types';
import { useAuthContext } from '../context/authContext';
import Image from 'next/image';


const page = () => {

  const {login} = useAuthContext()
  
  const { register, handleSubmit, setValue } = useForm<LoginFormData>();
 

  const onSubmit = (data:LoginFormData) => {
   
    if (data.rememberMe) {

      localStorage.setItem('email', data.email);
      Cookies.set('password', data.password, { expires: 7 }); // Set cookie to expire in 7 days
        
    } else {
      localStorage.removeItem('username');
      Cookies.remove('password');
    }


    login.mutate(data)
  };


  return (
    <div className="flex flex-col items-center justify-center sm:-mt-20 min-h-screen">
<Image src="/images/gett.png" alt="" width={100} height={100} />
  <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)} >
  
  <div className="-space-y-px flex flex-col  gap-5 rounded-md shadow-sm">
  
    <div >
      <label htmlFor="email-address" className="sr-only">
        Email address
      </label>
      <input
        id="email-address"
        type="email"
        autoComplete="email"
        {...register('email')}
        required
        className="relative block w-full appearance-none rounded-md border sm:min-w-[400px] border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        placeholder="Email address"
      />
    </div>
    <div>
      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input
        id="password"
        type="password"
        {...register('password')}
        autoComplete="current-password"
        required
        className="relative block w-full appearance-none rounded-md border sm:min-w-[400px] border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        placeholder="Password"
      />
    </div>
  </div>

  <div className="flex gap-5 items-center justify-between">
    <div className="flex items-center">
      <input
        id="remember-me"
        type="checkbox"
        {...register('rememberMe')}
        className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
      />
      <label htmlFor="remember-me" className="ml-2 block text-sm  text-slate-600">
        Remember me
      </label>
    </div>

    <div className="">
      <Link href="/forgot-password" className=" text-sm  bg-gradient-to-r from-[#f66830] to-[#fe5340] text-transparent bg-clip-text">
        Forgot your password?
      </Link>
    </div>
  </div>

  <div>
    <button
      type="submit"
      className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-[#408ffe] to-[#1764f4]  py-2 px-4 text-sm font-poppins text-white focus:outline-none "
    >
      {login?.isLoading? <Image src='/images/loader.svg' alt='' width="30" height="30" />
      :
      <>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
<path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
</svg>

      </span>
      Sign in
  </>
}
    </button>
  </div>
  <p className="mt-2 text-center text-sm text-slate-600">
    Return to {' '}
    <Link href="/signup" className="font-medium bg-gradient-to-r from-[#f66830] to-[#fe5340] text-transparent bg-clip-text">
      Register
    </Link>
  </p>
</form>
    </div>
  )
}

export default page