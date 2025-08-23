import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import { TicketProvider } from './context/TicketContext.tsx'
import { OrderProvider } from './context/OrderContext.tsx'

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

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
  <StrictMode>
    <AuthProvider>
    <TicketProvider>
      <OrderProvider>
   <Toaster/>
    <App />
    </OrderProvider>
   </TicketProvider>
    </AuthProvider>
  </StrictMode>
  </BrowserRouter>
  </QueryClientProvider>,
)
