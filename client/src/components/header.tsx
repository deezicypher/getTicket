import { useState } from 'react'
import Mobilebar from './mobilebar'
import Cart from './cart'
import {Link, useNavigate} from 'react-router-dom'
import { logo } from '../assets/images'
import { useAuthContext } from '../context/authContext'
import Search from './search'

const Header = () => {
  const {user,logout} = useAuthContext()
    const [toggle, setToggle] = useState<boolean>(false)
    const [showCart, setShowCart] = useState<boolean>(false)
    const [showSearch, setShowSearch] = useState<boolean>(false)

    const navigate = useNavigate()
   
  return (
<div className='flex relative flex-col'>
    <div className='sm:py-4 sm:px-6 xl:px-10 p-2 flex flex-row justify-between items-center'>
       
        <div className='flex sm:hidden'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8" onClick={() => setToggle(!toggle)}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
</svg>

        </div>

        <div className='cursor-pointer' onClick={() => navigate('/')}><img src={logo} alt='' className='h-10' /></div>

        <div className='flex flex-row items-center justify-center sm:gap-10 gap-5 '>
        <div className='text-slate-600 cursor-pointer '>
       <Link to='/all-tickets'>All Tickets</Link> 
        
    </div>

            <div className='flex  relative group transition-transform duration-300 hover:scale-110 cursor-pointer' onClick={() => setShowCart(!showCart)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 text-gray-600 ">
  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
</svg>
<div className="flex w-5 h-4 absolute bg-red-500 rounded-full  -right-1 top-2 items-center justify-center text-white text-xs">
    0
</div>
</div>
<div className='hidden sm:flex' onClick={() => setShowSearch(!showSearch)}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 transition-transform duration-300 hover:scale-110 cursor-pointer">
  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
</svg>

</div>
{!user?.id && (
<div className='hidden sm:flex gap-5'>
    <div className='text-slate-600 cursor-pointer '>
       <Link to='/signin'>Signin</Link> 
        
    </div>
    <div className='text-slate-600 cursor-pointer'>
    <Link to='/signup'>Signup</Link>
    </div>
</div>
)}
{user?.id && (
<div className='hidden sm:flex gap-5' >
<div className='cursor-pointer' title='Create Ticket' onClick={() => {navigate('/create-ticket')}} >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

</div>

<div className='text-slate-600 cursor-pointer '>
       <Link to='/my-tickets'>My Tickets</Link> 
        
    </div>
<div className='text-slate-600 cursor-pointer '>
       <Link to='/my-orders'>My Orders</Link> 
        
    </div>
    <div title='Logout' onClick={() => logout.mutate()} >
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 cursor-pointer">
  <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
</svg>
</div>


</div>
)}

        </div>
    </div>
{toggle  && (
    <Mobilebar toggle={toggle} setToggle={setToggle}/>
)}
{showCart && (
    <Cart showCart={showCart} setShowCart={setShowCart} toggle={toggle} />
)}
{showSearch && (
    <Search showSearch={showSearch} setShowSearch={setShowSearch} toggle={toggle} />
)}

    </div>
  )
}

export default Header