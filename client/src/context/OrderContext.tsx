import { useMutation } from '@tanstack/react-query'
import React, {useContext, createContext, useState} from 'react'
import { getAPI, postAPI } from '../utils/fetchData'
import toast from 'react-hot-toast'
import { OrderContextProps } from '../types'
import { useNavigate } from 'react-router-dom'

const OrderContext = createContext<OrderContextProps | null>(null)

export const OrderProvider = ({children}:{children:React.ReactNode}) => {
    const [order, setOrder] = useState<Record<string,any>>([])
    const [orders, setOrders] = useState<Record<string,any>>([])
    

    const navigate = useNavigate()

    const postOrder = useMutation({
        mutationFn: async (ticketId:string|undefined) => {
            const {data} = await postAPI('orders',{ticketId})
            return data
        },
        onSuccess: async (data) => {
           
            navigate(`orders/${data.id}`)
        },
        onError: async (error:any) => {
            error.response.data.error && toast.error(error.response.data.error)
            console.log('Get Ticket Error', error)
        }
    })

    const getOrder = useMutation({
        mutationFn: async (id:string|undefined) => {
            const {data} = await getAPI(`orders/${id}`)
            return data
        },
        onSuccess: async (data) => {
            
            setOrder(data)
        },
        onError: async (error:any) => {
            
            console.log('Get Ticket Error', error)
        }
    })

    const getOrders = useMutation({
        mutationFn: async () => {
            const {data} = await getAPI('orders')
            return data
        },
        onSuccess: async (data) => {
            
            setOrders(data)
        },
        onError: async (error:any) => {
            
            console.log('Get Ticket Error', error)
        }
    })

    const postPayment = useMutation({
        mutationFn: async (objects:{token:string; orderId:string;}) => {
            const {token, orderId} = objects
            const {data} = await postAPI('payments',{token, orderId})
            return data
        },
        onSuccess: async (data) => {
            navigate(`my-orders/${data.id}`)
        },
        onError: async (error:any) => {
            
            console.log('Get Ticket Error', error)
        }
        
    })
    return (
        <OrderContext.Provider value={{postOrder,order,getOrder, postPayment, getOrders, orders}}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => {
    const context = useContext(OrderContext)
    if(!context) throw Error ("useTicketContext must be used within an TicketProvider");
    return context;
  
}