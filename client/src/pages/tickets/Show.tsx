import { useParams } from "react-router-dom"
import { useTicket } from "../../context/TicketContext"
import { useEffect } from "react"
import moment from 'moment'
import { loader, ticketLoader } from "../../assets/images"
import { useOrder } from "../../context/OrderContext"



const Show = () => {
  const {id} = useParams<{id:string}>()
  const {getTicket,ticket,ticketLoading} = useTicket()
  const {postOrder} = useOrder()

  
  useEffect(()=> {
    getTicket.mutate(id)
  },[])

  if(ticketLoading) {
      return (
      <div className='flex  flex-col gap-2 sm:mt-20 mt-10  items-center  sm:p-10 p-4 '>
        <img src={ticketLoader} alt="" className="w-12 h-12" />
        </div>
    )
  }
  if(!ticket?.title) {
    return (<div className='flex  flex-col gap-2 sm:mt-20 mt-10  justify-center items-center  sm:p-10 p-4 '>
      <div className="flex flex-col gap-2 justify-center items-center">
   <div className='sm:text-[200px] text-[150px]'>
   🚫
   </div>
   <div className='sm:text-xl text-2xl text-center'>Ticket is not available</div>
   </div>
   </div>)
  }
  return (
    <div className='flex sm:flex-row flex-col gap-5 sm:mt-20 mt-10  justify-center items-center  sm:p-10 p-4 '>
        <div className='sm:text-[300px] text-[200px]'>
        📃
        </div>
        <div className='flex flex-col gap-5'>
            <div className='sm:text-3xl text-xl text-sky-800'>{ticket?.title && ticket.title.charAt(0).toUpperCase() + ticket.title.slice(1) }</div>
            <div className='sm:text-6xl text-4xl text-green-600'>${ticket.price}</div>
            <hr className='text-slate-300'/>
            <div className="text-xl">Status: <span className="">{ticket?.status}</span></div>
            <div className='text-sm'>{ticket?.created_at && moment(ticket?.created_at).format("MMM Do YY")}</div>
            <hr className='text-slate-300'/>

            <button
                onClick={()=> postOrder.mutate(ticket.id)}
                className=" cursor-pointer group relative flex  justify-center rounded-md bg-gradient-to-r from-[#f83511] to-[#f14a18]  py-2 px-4 text-sm font-poppins text-white focus:outline-none "
              >
                {postOrder?.isPending? <img src={loader} alt='' className="h-4" />
                :
                <>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
</svg>


          
                </span>
                Order
            </>
          }
              </button>
        </div>

    </div>
  )
}

export default Show