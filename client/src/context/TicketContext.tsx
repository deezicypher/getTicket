import React, { useContext,createContext, useState } from "react";
import {  useMutation } from '@tanstack/react-query';
import { getAPI, postAPI } from "../utils/fetchData";
import toast from "react-hot-toast";
import { TicketContextProps, TicketInputs } from "../types";
import { useNavigate } from "react-router-dom";


const TicketContext = createContext<TicketContextProps | null>(null)

export const TicketProvider = ({children}:{children:React.ReactNode}) => {
            const [tickets, setTickets] = useState<Record<string, any>[]>([])
            const [ticket, setTicket] = useState<Record<string, any>[]>([])
            const [ticketLoading, setTicketLoading] = useState<boolean>(true)
            const [searchedTicket, setSearchedTicket] = useState<Record<string, any>[]>([])

            const navigate = useNavigate()
           

         const createTicket = useMutation({
            mutationFn: async (data:TicketInputs) => {
                const res = postAPI('tickets', data)
                return res
            },
            onSuccess: async () => {
                toast.success('Ticket Created')
                
                navigate('/')
            },
            onError: async (error:any) => {
                error.response.data.error && toast.error(error.response.data.error)
                console.log('Create Ticket Error',error)
            }
        })

        const getTickets = useMutation({
            mutationFn: async (id?:string) => {
                
                const {data} = await getAPI(`tickets?userId=${id}`)
                return data
            },
            onSuccess: async (data:any) => {
                setTickets(data)
                 
            },
            onError: async (error) => {
                console.log('Get Tickets Error', error)
                
            }
        })

        const getTicket = useMutation({
            mutationFn: async (id:string|undefined) => {
                const {data} =  await getAPI(`tickets/${id}`)
                return data
            },
            onSuccess : async (data:any) => {
                setTicket(data)
                setTicketLoading(false)
                
            },
            onError: async (error) => {
                console.log('Get Ticket Error', error)
                setTicketLoading(false)
            }
        })

        const searchTicket = useMutation({
            mutationFn: async (searchId:string) => {
                const {data} = await getAPI(`tickets?searchId=${searchId}`)
                return data
            },
            onSuccess: async (data:Record<string, any>[]) => {
                setSearchedTicket(data)
            },
            onError: async (error) => {
                console.log('Get Searched Ticket Error', error)
                setTicketLoading(false)
            }
        })
    
    return (
        <TicketContext.Provider value={{createTicket, getTickets, tickets,ticket,getTicket,ticketLoading, searchTicket, searchedTicket,setSearchedTicket}}>
            {children}
        </TicketContext.Provider>
    )
}

export const useTicket = () => {
    const context = useContext(TicketContext)
    if(!context) throw Error ("useTicketContext must be used within an TicketProvider");
  return context;

}