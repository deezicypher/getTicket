import {Dispatch,SetStateAction,FC} from 'react'

interface MobileProps {
    toggle:boolean;
    setToggle: Dispatch<SetStateAction<boolean>>
}

const Mobilebar:FC<MobileProps> = ({toggle,setToggle}) => {
  return (
    <>
        {toggle && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30"
          onClick={() => setToggle(!toggle)} // Close navbar when backdrop is clicked
        ></div>
      )}
    <div className='absolute z-20 top-10 p-2 w-full'>
    
        <div className={`flex items-start justify-between  bg-white gap-5 p-4 text-black  rounded-md  transform transition-transform duration-300 ${
          toggle ? 'translate-x-0' : '-translate-x-full'
        }`}>
    
            <div className='flex flex-col justify-between gap-5'>
            <div className='flex gap-2'>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6">
  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
</svg>
<div className=''>Search</div>
</div>
<div className='flex gap-2'>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
</svg>

<div className=''>Login</div>
</div>
<div className='flex gap-2'>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
</svg>

<div className=''>Register</div>
</div>
<div className='flex '>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 text-gray-600 ">
  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
</svg>
<div className="flex w-5 h-4 absolute bg-red-500 rounded-full  items-center justify-center text-white text-xs">
    0
</div>
</div>
            </div>

            <div className='flex' onClick={() => setToggle(!toggle)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 cursor-pointer">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

            </div>
        </div>
    </div>
    </>
  )
}

export default Mobilebar