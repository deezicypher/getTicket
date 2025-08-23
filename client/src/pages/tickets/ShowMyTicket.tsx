import moment from 'moment'
import { useParams } from 'react-router-dom'
import { ticketLoader } from '../../assets/images'
import { useEffect } from 'react'
import { useTicket } from '../../context/TicketContext'

const ShowMyTicket = () => {
    const {id} = useParams<{id:string}>()
    const {getTicket,ticket} = useTicket()

    useEffect(() => {
        getTicket.mutate(id)
    },[])

    if(getTicket.isPending) {
        return (
        <div className='flex  flex-col gap-2 sm:mt-20 mt-10  items-center  sm:p-10 p-4 '>
          <img src={ticketLoader} alt="" className="w-12 h-12" />
          </div>
      )
    }
    if(!ticket?.id) {
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
        <div className='sm:text-3xl text-xl'>{ticket?.title && ticket.title.charAt(0).toUpperCase() + ticket.title.slice(1) }</div>
        <div className="text-xl">Ticket ID: <span className="">{ticket?.id}</span></div>
              <div className='sm:text-6xl text-4xl text-green-600'>${ticket.price}</div>
              <hr className='text-slate-300'/>
              <div className="text-xl">Status: <span className="">{ticket?.status}</span></div>
              <div className='text-sm'>{moment(ticket?.created_at).format("MMM Do YY")}</div>
              <hr className='text-slate-300'/>
  
             
          </div>
  
      </div>
    )
}

export default ShowMyTicket