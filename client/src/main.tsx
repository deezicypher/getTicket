import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/authContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

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
    <AuthContextProvider>
   <Toaster/>
    <App />
   
    </AuthContextProvider>
  </StrictMode>
  </BrowserRouter>
  </QueryClientProvider>,
)
