//@ts-ignore
import { useForm,SubmitHandler } from "react-hook-form";
import { loader } from "../../assets/images";
import { useTicket } from "../../context/TicketContext";
import { TicketInputs } from "../../types";





const New = () => {
     const { register, handleSubmit,  } = useForm<TicketInputs>();
      const {createTicket} = useTicket() 


     const onSubmit: SubmitHandler<TicketInputs> = (data:TicketInputs) => {
        createTicket.mutate(data)
     }
  return (
  
       <div className="flex flex-col items-center  min-h-screen p-4">
            <h1  className="font-rubik font-bold text-center mt-10 text-3xl no-underline sm:text-5xl bg-gradient-to-r from-[#408ffe] to-[#1764f4] text-transparent bg-clip-text">
            Create Ticket</h1>
            <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)} >
            
            <div className="-space-y-px flex flex-col  gap-5 rounded-md shadow-sm">
            
              <div >
                <label htmlFor="title" className="sr-only">
                  Title
                </label>
                <input
                  id="title"
                  type="title"
                  autoComplete="title"
                  {...register('title')}
                  required
                  className="relative block w-full appearance-none rounded-md border sm:min-w-[400px] border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Title"
                />
              </div>
              <div>
                <label htmlFor="price" className="sr-only">
                  Price
                </label>
                <input
                  id="price"
                  
                  type="number"
                  step="0.01"
                  {...register('price')}
                  autoComplete="price"
                  required
                  className="relative block w-full appearance-none rounded-md border sm:min-w-[400px] border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Price"
                />
              </div>
            </div>
          
            <div className="flex gap-5 items-center justify-between">
     
          
         
            </div>
          
            <div>
              <button
                type="submit"
                className="cursor-pointer group relative flex w-full justify-center rounded-md bg-gradient-to-r from-[#408ffe] to-[#1764f4]  py-2 px-4 text-sm font-poppins text-white focus:outline-none "
              >
                {createTicket?.isPending? <img src={loader} alt='' className="h-4" />
                :
                <>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>

          
                </span>
                Submit
            </>
          }
              </button>
            </div>
     
          </form>
              </div>
  )
}

export default New