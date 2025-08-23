import React, { useEffect } from 'react'
import { useOrder } from '../../context/OrderContext'
import { ticketLoader } from '../../assets/images'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const List = () => {
    const {orders, getOrders} = useOrder()
    const navigate = useNavigate()

    useEffect(() => {
        getOrders.mutate()
    }, [])
      if(getOrders.isPending) {
          return (
          <div className='flex  flex-col gap-2 sm:mt-20 mt-10  items-center  sm:p-10 p-4 '>
            <img src={ticketLoader} alt="" className="w-12 h-12" />
            </div>
        )
      }
  return (
    <div className='flex  flex-col gap-5 mt-10  justify-center items-center  sm:p-10 p-4 '>
         <div className='flex flex-col gap-5'>
        <div className='text-3xl   text-sky-900'>My Orders</div>
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
        {orders?.map( (order:Record<string, any>,index:React.Key) => (
                    <tr key={index}>
                    <td className=" border-b border-slate-100  p-4 pl-8 text-slate-300 ">{order.title}</td>
                    <td className="border-b border-slate-100  p-4 text-slate-300 ">${order?.price?.toLocaleString()}</td>
                    <td className="border-b border-slate-100  p-4 text-slate-300 ">{order?.status}</td>
                    <td className="border-b border-slate-100  p-4 pr-8 text-slate-300 ">{ moment(order.created_at).format("MMM Do YY")}</td>
                   
                    
                    <td className="border-b border-slate-100  p-4 pr-8 text-slate-300 ">
                        <div onClick={() => navigate(`/my-orders/${order.id}`)} className='cursor-pointer bg-gradient-to-r w-max from-[#408ffe] to-[#1764f4] rounded-md py-2 px-4 text-sm font-poppins text-white focus:outline-none'>
                            View Order
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

export default List