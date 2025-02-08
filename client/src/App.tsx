
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'
import Verify from './pages/auth/Verify'
import ResetPass from './pages/auth/ResetPass'
import ForgotPass from './pages/auth/ForgotPassword'



function App() {
 
  return (
   
      <Routes>
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
