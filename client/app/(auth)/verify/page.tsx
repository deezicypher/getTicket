'use client'
import React,{useState, useEffect} from 'react'
import { useMutation } from 'react-query';
import Image from 'next/image';
import toast from 'react-hot-toast'
import { postAPI } from '../../../utils/fetchData';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/authContext';
import Link from 'next/link';


const page = () => {

  const {getVerify} = useAuthContext()
    const router = useRouter();

    const searchParams = useSearchParams()
    const token = searchParams.get('token');


    useEffect(() => {
        window.scrollTo(0, 0);
        toast.loading('Verifying Email...',{
            id:"email"
        });
        if (token) {
        getVerify.mutate(token)   
        }
    }, [token,router]);


  return (
    <div className="flex flex-col items-center justify-center sm:-mt-20 min-h-screen">
<Link href={'/'}><Image src="/images/gett.png" alt="" width={100} height={100} /></Link>
{getVerify.isLoading && (
    <>
      
      <p className='font-epilogue mt-[20px] font-bold text-[20px] text-slate-600 text-center'>
          Loading....
      </p>
      </>
)}
 {getVerify.isSuccess  && (
        <div className="text-center flex items-center justify-center">
        <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-[#40feb8]  w-2/5 ">
  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
</svg>
</div>
 )}

  {getVerify.isError && (
        <div className="text-center flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2/5 text-red-600">
  <path d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
  <path d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
</svg>



<p className={`font-epilogue font-normal sm:text-base text-primary text-sm  leading-[30.8px] mb-10 p-4 md:w-4/5 mt-5 `}>
Email may be already verified or the link is broken.
  </p>
</div>
 )}
    </div>
  )
}

export default page