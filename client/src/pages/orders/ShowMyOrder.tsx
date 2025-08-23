import moment from 'moment'
import { useParams } from 'react-router-dom'
import { ticketLoader } from '../../assets/images'
import { useOrder } from '../../context/OrderContext'
import { useEffect } from 'react'

const ShowMyOrder = () => {
    const {id} = useParams<{id:string}>()
    const {getOrder,order} = useOrder()

    useEffect(() => {
        getOrder.mutate(id)
    },[])

    if(getOrder.isPending) {
        return (
        <div className='flex  flex-col gap-2 sm:mt-20 mt-10  items-center  sm:p-10 p-4 '>
          <img src={ticketLoader} alt="" className="w-12 h-12" />
          </div>
      )
    }
    if(!order?.id) {
      return (<div className='flex  flex-col gap-2 sm:mt-20 mt-10  justify-center items-center  sm:p-10 p-4 '>
        <div className="flex flex-col gap-2 justify-center items-center">
     <div className='sm:text-[200px] text-[150px]'>
     🚫
     </div>
     <div className='sm:text-xl text-2xl text-center'>Order is not available</div>
     </div>
     </div>)
    }
    return (
      <div className='flex sm:flex-row flex-col gap-5 sm:mt-20 mt-10  justify-center items-center  sm:p-10 p-4 '>
          <div className='sm:text-[300px] text-[200px]'>
          📃
          </div>
          <div className='flex flex-col gap-5'>
              <div className='sm:text-3xl text-xl text-sky-800'>{order?.ticket?.title && order.ticket.title.charAt(0).toUpperCase() + order.ticket.title.slice(1) }</div>
              <div className="text-xl text-slate-800">Order ID: <span className="">{order?.id}</span></div>
              <div className='sm:text-6xl text-4xl text-green-600'>${order?.ticket.price}</div>
              <hr className='text-slate-300'/>
              <div className="text-xl text-slate-900">Status: <span className="">{order?.status}</span></div>
              <div className='text-sm'>{moment(order.ticket?.created_at).format("MMM Do YY")}</div>
              <hr className='text-slate-300'/>
  
             
          </div>
  
      </div>
    )
}

export default ShowMyOrder