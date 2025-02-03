"use client"
import React from 'react'
import './globals.css'
import {Toaster} from 'react-hot-toast'
import {QueryClientProvider, QueryClient} from 'react-query'
import { AuthContextProvider } from './context/authContext'


const queryClient = new QueryClient(
  {
     defaultOptions:{
        queries:{
           refetchOnMount:true,
           refetchOnWindowFocus: false,
        }
     }
  }
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthContextProvider>   
           <body>{children}</body>
           </AuthContextProvider>

      </QueryClientProvider>
    </html>
  )
}