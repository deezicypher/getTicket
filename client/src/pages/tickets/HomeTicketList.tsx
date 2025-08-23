import { useEffect } from 'react'
import { useTicket } from '../../context/TicketContext'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'


const List =  () => {
    const {tickets,getTickets} = useTicket()
   const navigate = useNavigate()
    useEffect(()=> {
      getTickets.mutate(undefined)
    },[])


  return (
    <div className='flex flex-col gap-5 items-center  mt-10'>
 
    <div className='flex flex-wrap gap-5 items-center justify-center sm:p-10 p-4'>
      {tickets?.slice(-18).map((ticket:Record<string,any>) =>  {
        return (
        <div onClick={() => navigate(`/tickets/${ticket.id}`)} key={ticket.id} className='cursor-pointer flex text-center flex-col shadow-xl p-4 border rounded-md border-slate-300 sm:w-[250px] w-full gap-2 h-[300px]'>
        <div className=" text-6xl">
          📃
        </div>
            <div className='flex flex-col gap-5'>
                <div className='text-xl text-slate-800 '>{ticket?.title && ticket.title.charAt(0).toUpperCase() + ticket.title.slice(1) }</div>
                <hr className='text-slate-300'/>
                <div className='text-3xl text-green-600'>${ticket.price}</div>
                <div className='text-sm'>{moment(ticket.created_at).format("MMM Do YY")}</div>
            </div>
        </div>
        
        )
        
})}
    </div>
    <div className='flex flex-col gap-5 mb-20'>
    <hr className='text-slate-300'/>
    <div className='cursor-pointer rounded md bg-blue-600 py-2 px-4 text-sm font-poppins text-white' onClick={() => navigate('/all-tickets')}>Show all Tickets</div>
   
    </div>
    </div>
  )
}

export default List