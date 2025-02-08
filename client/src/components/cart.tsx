import {Dispatch,SetStateAction,FC} from 'react'

interface cartProps {
    toggle:boolean;
    showCart:boolean;
    setShowCart: Dispatch<SetStateAction<boolean>>
}
const Cart:FC<cartProps> = ({showCart,setShowCart}) => {
  return (
    <div className='fixed inset-0  backdrop-blur-sm bg-black/30' onClick={() => setShowCart(!showCart)}>
        <div className='p-2 top-10 py-12 sm:top-0 sm:py-0 sm:p-0 z-20'>
            <div className={`bg-white rounded-md  p-2 text-black sm:w-1/4 sm:ml-auto sm:h-screen`}>

                <div className='flex flex-col w-full'>
                    <div className='flex flex-row items-start justify-between'>
                        <div className='flex items-center gap-2'>
                    <div className='flex  relative group transition-transform duration-300 hover:scale-110 cursor-pointer' onClick={() => setShowCart(!showCart)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 sm:h-26 text-gray-600 ">
                                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                                </svg>
                                <div className="flex w-5 h-4 sm:w-10 sm:h-10 sm:text-xl absolute bg-red-500 rounded-full  -right-1 top-2 items-center justify-center text-white text-xs">
                                    0
                                </div>
                                </div>
                            <div className='text-sm sm:text-2xl'>
                                Your Cart
                            </div>
                        </div>
                        <div className='flex' onClick={() => setShowCart(!showCart)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 sm:w-16 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                    </div>
                    </div>
                    <hr className="w-1/2 sm:w-full border-t border-gray-300 my-4 justify-center mx-auto" /> 
                    <div className='flex flex-col items-start '>
                    <div className='flex gap-2'>
                            <div className='h-12'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
                            </svg>
                            </div>
                            <div className='text-sm'>
                                Servers
                            </div>
                    </div>
                    <div className='flex gap-2'>
                            <div className='h-12'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
                            </svg>
                            </div>
                            <div className='text-sm'>
                                Servers
                            </div>
                    </div>
                    </div>

             
                    <div className='flex flex-col items-center '>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-16 sm:h-26">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <div className='text-base sm:text-2xl'>Cart is Empty</div>
        <div className='bg-red-500 rounded-full py-2 px-4 mt-5 text-white text-xs sm:text-xl'>Continue Shopping</div>
        
                    </div>
                </div>





            
            </div>
        </div>
    </div>
  )
}

export default Cart