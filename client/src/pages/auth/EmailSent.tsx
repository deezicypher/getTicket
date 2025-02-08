import {FormEvent} from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import {useMutation} from '@tanstack/react-query'

import { postAPI } from '../../utils/fetchData'
import { loader, logo } from '../../assets/images'
import { Link } from 'react-router-dom'




const EmailSent = () => {
    const userCookie = Cookies.get('regdata');
    const regdata = userCookie ? JSON.parse(userCookie) : {};
   
    const sendMail = useMutation( {
      mutationFn: async () => {

          const res = await postAPI('users/resend-email', {
          ...regdata
      })
        return res.data
 
    },
        onMutate: () => {
            toast.loading('Sending email....',{
              id: 'email'
            })
          },
            onSuccess: (data:{msg:string}) => {
              toast.success(data.msg,{
                id:"email"
              });
            },
            
              onError: (error: any) => {
                toast.error(error.response?.data?.error);
                console.error('Resend Email error:', error);
              }
    }
    )
 

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMail.mutate()
}
  return (
    <div className="flex flex-col items-center justify-center sm:-mt-20 min-h-screen">
  <Link to='/'><img src={logo} alt="" className=" h-10" /></Link>
<h1  className="font-rubik font-bold text-center mt-10 text-3xl no-underline sm:text-5xl bg-gradient-to-r from-[#408ffe] to-[#1764f4] text-transparent bg-clip-text">

Email Sent
</h1>
<p className='text-2xl mt-5 font-poppins  font-bold text-slate-600  text-center sm:max-w-[700px]'>
Verification email sent! Check your inbox for an email from us and follow the prompts to verify your account.
</p> 
  
    


<form className="mt-20 space-y-6" >
   <p className="mt-2 text-center text-base text-slate-600">
          Didn't get the email?
        </p>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={regdata?.email}
                  autoComplete="email"
                  required
                  readOnly
                  className="relative block w-full appearance-none sm:min-w-[400px] rounded-md  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                  placeholder="Email address"
                />
              </div>

            <div>
              <button
                onClick={(e:any) => onSubmit(e as FormEvent<HTMLFormElement>)}
                className="group relative flex w-full justify-center rounded-md  bg-gradient-to-r from-[#408ffe] to-[#1764f4] py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2  focus:ring-offset-2"
              >
                  {sendMail.isPending? <img src={loader} alt='' className="h-4" />
                    :
                    <>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
</svg>


                </span>
                </>
}
               Resend Email
              </button>
            </div>
          </form>

</div>
  )
}

export default EmailSent