'use client'
import React,{useState} from 'react'
import { useMutation } from 'react-query'
import { useAuthContext } from '../../context/authContext'
import Link from 'next/link'
import Image from 'next/image'

const page = () => {
    const [email, setEmail] = useState<string>()
   const {sendPass} = useAuthContext()

   const onSubmit = async (e:any) => {  
    e.preventDefault()  
    sendPass.mutate(email)
   }
   
  return (
    <div className="flex flex-col items-center justify-center sm:-mt-20 min-h-screen p-4">
   <Link href={'/'}> <Image src="/images/gett.png" alt="" width={100} height={100} /> </Link>
    <h1  className="font-rubik font-bold text-center mt-10 text-3xl no-underline sm:text-5xl bg-gradient-to-r from-[#408ffe] to-[#1764f4] text-transparent bg-clip-text">
Forgot Password
</h1>
    <form className="mt-10 space-y-6 sm:w-100 w-full" onSubmit={onSubmit} >
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="-space-y-px flex flex-col  gap-5 rounded-md shadow-sm">
        <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none  sm:min-w-[400px] rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  sm:text-sm"
                  placeholder="Email address"
                />
              </div>
        </div>

        <div>
          <button
            type='submit'
            className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-[#408ffe] to-[#1764f4]  py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
  
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
</svg>

            </span>
            Submit
          </button>
        </div>
      </form>
        </div>
  )
}

export default page