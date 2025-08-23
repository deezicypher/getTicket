import {Dispatch,SetStateAction,FC, useEffect, ChangeEvent} from 'react'
import { useTicket } from '../context/TicketContext';
import { useNavigate } from 'react-router-dom';

interface searchProps {
    toggle:boolean;
    showSearch:boolean;
    setShowSearch: Dispatch<SetStateAction<boolean>>
}
const Search:FC<searchProps> = ({showSearch,setShowSearch}) => {
   
    const {searchTicket, searchedTicket, setSearchedTicket} = useTicket()
    const navigate = useNavigate()

    const getSearch = (e:ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if(e.target.value === '') {
            return setSearchedTicket([])
        }
        searchTicket.mutate(e.target.value)
        console.log(searchedTicket)
       
    }

    const setShowSearchFalse = () => {
        setSearchedTicket([])
        setShowSearch(!showSearch)
    }
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            setShowSearch(false);
            setSearchedTicket([])
          }
        };
    
        window.addEventListener("keydown", handleKeyDown);
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, [setShowSearch]);
    
      if (!showSearch) return null;

      
  return (
    <div className='fixed inset-0  backdrop-blur-sm bg-black/30' onClick={() => setShowSearchFalse()}>
        <div className='p-2 top-10 py-12 sm:top-0 sm:py-0 sm:p-0 z-20' onClick={(e) => e.stopPropagation()} >
            <div className={`bg-white rounded-md  sm:p-10 p-2 text-black sm:w-2/4 sm:ml-auto sm:h-screen`}>

                <div className='flex flex-col w-full gap-5'>
                    <div className='flex flex-row items-start justify-between'>
                       
                            <div className='text-sm sm:text-2xl p-4 text-center'>
                                Search GetTickets
                            </div>
                      
                        <div className='flex' onClick={() => setShowSearchFalse()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 sm:w-16 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                    </div>
                    </div>
                    <div className='flex border-4 border-blue-300 rounded-md w-full'>
                        <input type='text' className='w-full h-15 border-none focus:outline-none' onChange={e => getSearch(e)} />
                    </div>
                    <hr className="w-1/2 sm:w-full border-t border-gray-300 my-4 justify-center mx-auto" /> 
                
                <div className='flex flex-col gap-5 overflow-auto sm:px-10 sm:h-[700px] h-[600px]'>
                    {searchedTicket.map((ticket:Record<string,any>,index:React.Key) => {
                        return (
                            <div onClick={() => navigate(`/tickets/${ticket.id}`)} key={index} className='rounded-md flex flex-col shadow-md border-slate-300 border p-4'>
                            <div className='text-4xl'> 📃</div>
                            <div className='flex justify-between'>
                                <div className='text-xl'>{ticket.title}</div>
                                <div className='text-xl text-green-600'>{ticket.price}</div>
                            </div>
                            </div>
                        )
                    })}
                  
            
                </div>
                </div>





            
            </div>
        </div>
    </div>
  )
}

export default Search