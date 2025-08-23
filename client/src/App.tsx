
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'
import Verify from './pages/auth/Verify'
import ResetPass from './pages/auth/ResetPass'
import ForgotPass from './pages/auth/ForgotPassword'
import { useAuthContext } from './context/authContext'

import { useEffect } from 'react'
import Loader from './utils/Loader'
import Root from './components/layout/root'
import New from './pages/tickets/New'
import Show from './pages/tickets/Show'
import ShowOrder from './pages/orders/Show'
import List from './pages/orders/List'
import ShowMyOrder from './pages/orders/ShowMyOrder'
import ShowMyTicket from './pages/tickets/ShowMyTicket'
import MyTicketList from './pages/tickets/MyTicketList'
import AllTickets from './pages/tickets/AllTickets'

interface ProtectedRouteProps {
  user: {id?:string} | null;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({user,children}) => {
  const location = useLocation()

  if(!user!.id){
      return <Navigate to="/signin" 
      replace state={{ from: location.pathname}} //saves where they were going 
      />
  }
  return children
}

function App() {
  const {user, getUserLoading} = useAuthContext()
  //const lastVisitedURL = localStorage.getItem('lastVisitedURL')



  useEffect(() => {
   localStorage.setItem('lastVisitedURL', window.location.pathname);
 }, [window.location.pathname]);
 if (getUserLoading) {
  return <Loader/> 
}
  return (
   
      <Routes>
    <Route element={<Root />}>
        <Route path="/create-ticket" element={<ProtectedRoute user={user}><New/></ProtectedRoute>} />
        <Route path='/tickets/:id' element={<ProtectedRoute user={user}><Show/></ProtectedRoute>} />
        <Route path='/my-tickets' element={<ProtectedRoute user={user}><MyTicketList/></ProtectedRoute>} />
        <Route path='/all-tickets' element={<ProtectedRoute user={user}><AllTickets/></ProtectedRoute>} />
        <Route path='/my-tickets/:id' element={<ProtectedRoute user={user}><ShowMyTicket/></ProtectedRoute>} />
        <Route path='/orders/:id' element={<ProtectedRoute user={user}><ShowOrder/></ProtectedRoute>} />
        <Route path='/my-orders' element={<ProtectedRoute user={user}><List/></ProtectedRoute>} />
        <Route path='/my-orders/:id' element={<ProtectedRoute user={user}><ShowMyOrder/></ProtectedRoute>} />
        <Route path='/my-orders' element={<ProtectedRoute user={user}><List/></ProtectedRoute>} />
        </Route>
            <Route path='/' element={<Home/>} />
            <Route path='/signin' element={<Signin/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/verify' element={<Verify/>} />
            <Route path='/reset-password' element={<ResetPass/>} />
            <Route path='/forgot-password' element={<ForgotPass/>} />
            <Route path="*" element={<Navigate to="/" />} />
        
        </Routes>

    
  )
}

export default App
