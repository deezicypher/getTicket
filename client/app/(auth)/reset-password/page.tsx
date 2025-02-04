'use client'
import React, { FormEvent } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { useForm } from'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useAuthContext } from '../../context/authContext';
import Image from 'next/image';
import { ResetPassProps } from '../../../types';
import Link from 'next/link';


const page = () => {

const {resetPass} = useAuthContext()
        const searchParams = useSearchParams()
        const token = searchParams.get('token');
    

    const formSchema = yup.object().shape({
        password: yup.string()
        .required('Please enter a password')
        .matches(/^\S*$/, 'Whitespace is not allowed')
        .min(6, 'Password must be at 6 characters long'),
        password2: yup.string()
        .required('Confirm password')
        .oneOf([yup.ref('password')], 'Passwords does not match'),
      }) 

      const formOptions = { resolver: yupResolver(formSchema) }
      const { register, handleSubmit, formState: { errors } } = useForm(formOptions);


      const onSubmit = async (data:ResetPassProps) => {
        resetPass.mutate({...data,token})
    }

  return (
      <div className="flex flex-col items-center justify-center sm:-mt-20 min-h-screen p-4">
      <Link href={'/'}><Image src="/images/gett.png" alt="" width={100} height={100} /></Link>
      <h1  className="font-rubik font-bold text-center mt-10 text-3xl no-underline sm:text-5xl bg-gradient-to-r from-[#408ffe] to-[#1764f4] text-transparent bg-clip-text">
  Reset Password
  </h1>
  <form className="mt-8 space-y-6 sm:w-100 w-full" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="-space-y-px flex flex-col  gap-5 rounded-md shadow-sm">
       
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
                  className="relative block w-full appearance-none sm:min-w-[400px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="password2" className="sr-only">
                  Confirm Password
                </label>
                {errors.password2 && <p className='text-red-500 text-[14px] mb-2' role="alert">{errors.password2?.message}</p>}
               
                <input
                  id="password2"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...register('password2')}
                  className="relative block w-full appearance-none sm:min-w-[400px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
        </div>


        <div>
          <button
            type="submit"
            className="group relative flex w-full sm:min-w-[400px] justify-center bg-gradient-to-r from-[#408ffe] to-[#1764f4]  py-2 px-4 text-sm font-medium text-white focus:outline-none rounded-md"
          >
              {resetPass.isLoading? (<Image src='/images/loader.svg' alt='' width="30" height="30" />)
                :
                <>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
</svg>
            </span>
            </>}
            Reset Password
          </button>
        </div>
      </form>
  
  </div>
  )
}

export default page