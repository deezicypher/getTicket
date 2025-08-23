import React, { useEffect } from 'react'
import { ticketLoader } from '../../assets/images'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useTicket } from '../../context/TicketContext'
import { useAuthContext } from '../../context/authContext'

const MyTicketList = () => {
    const {user} = useAuthContext()
    const {tickets, getTickets} = useTicket()
    const navigate = useNavigate()

    useEffect(() => {
        getTickets.mutate(user?.id)
    }, [])
      if(getTickets.isPending) {
          return (
          <div className='flex  flex-col gap-2 sm:mt-20 mt-10  items-center  sm:p-10 p-4 '>
            <img src={ticketLoader} alt="" className="w-12 h-12" />
            </div>
        )
      }
  return (
    <div className='flex  flex-col gap-5  mt-10  justify-center items-center  sm:p-10 p-4 '>
         <div className='flex flex-col gap-5'>
        <div className='text-3xl   text-sky-900'>My Tickets</div>
        <hr className='text-slate-300'/>
        </div>
     
          <table className="border-collapse table-auto w-full text-sm ">
    <thead>
      <tr>
        <th className="border-b dark:border-[#4b4333] font-medium p-4 pl-8 pt-0 pb-3 text-slate-600  text-left">Title</th>
        <th className="border-b dark:border-[#4b4333] font-medium p-4 pt-0 pb-3 text-slate-600  text-left">Amount</th>
        <th className="border-b dark:border-[#4b4333] font-medium p-4 pr-8 pt-0 pb-3 text-slate-600  text-left">Status</th>
        <th className="border-b dark:border-[#4b4333] font-medium p-4 pr-8 pt-0 pb-3 text-slate-600  text-left">On</th>
        
        
        <th className="border-b dark:border-[#4b4333] font-medium p-4 pr-8 pt-0 pb-3 text-slate-600  text-left">Action</th>
      </tr>
    </thead>
    <tbody className="bg-[#101010] rounded-md">
        {tickets.map( (ticket:Record<string, any>,index:React.Key) => (
                    <tr key={index}>
                    <td className=" border-b border-slate-100  p-4 pl-8 text-slate-300 ">{ticket.title}</td>
                    <td className="border-b border-slate-100  p-4 text-slate-300 ">${ticket?.price?.toLocaleString()}</td>
                    <td className="border-b border-slate-100  p-4 text-slate-300 ">{ticket?.status}</td>
                    <td className="border-b border-slate-100  p-4 pr-8 text-slate-300 ">{ moment(ticket.created_at).format("MMM Do YY")}</td>
                   
                    
                    <td className="border-b border-slate-100  p-4 pr-8 text-slate-300 ">
                        <div onClick={() => navigate(`/my-tickets/${ticket.id}`)} className='cursor-pointer bg-gradient-to-r w-max from-[#408ffe] to-[#1764f4] rounded-md py-2 px-4 text-sm font-poppins text-white focus:outline-none'>
                            View Ticket
                        </div>
                    </td>
                  </tr>
        )
    )
 }
  
       
    </tbody>
  </table>
    </div>
  )
}

export default MyTicketList