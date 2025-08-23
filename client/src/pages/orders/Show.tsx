import { useEffect, useState } from "react"
import { useOrder } from "../../context/OrderContext"
import { useParams } from "react-router-dom"
import  StripeCheckout from 'react-stripe-checkout'
import { useAuthContext } from "../../context/authContext"

const stripe_key = import.meta.env.VITE_STRIPE_KEY

const Show = () => {
    const {order,getOrder, postPayment} = useOrder()
    const {user} = useAuthContext()
    const {id} = useParams<{id:string}>()

    const [timeleft, setTimeLeft] = useState<number | null>(null)

    useEffect(() => {
        if (!order?.expires_at) return; // guard for undefined/null
      
        const findTimeLeft = () => {
          const expiresAt = new Date(order.expires_at).getTime();
          const now = Date.now();
          const msLeft = expiresAt - now;
      
          if (isNaN(expiresAt)) {
            setTimeLeft(null); // invalid date
            return;
          }
      
          setTimeLeft(Math.max(0, Math.floor(msLeft / 1000))); // prevent negatives
        };
      
        findTimeLeft(); // run immediately
      
        const timerId = setInterval(findTimeLeft, 1000);
      
        return () => clearInterval(timerId);
      }, [order?.expires_at]);
      

      useEffect(()=> {
        getOrder.mutate(id)
      },[])

if(timeleft !== null && timeleft <= 0 ) {
    return (
            <div className='flex  flex-col gap-2 sm:mt-20 mt-10  justify-center items-center  sm:p-10 p-4 '>
       <div className='sm:text-3xl text-2xl text-center '>Order Expired</div>
       <div className="flex sm:flex-row flex-col gap-2 justify-center items-center">
    <div className='sm:text-[200px] text-[150px]'>
    ⌛
    </div>
    <div className='flex flex-col gap-5'>
        
  
     <hr className='text-slate-300'/>
     

    

    </div>
</div>
    </div>
    )
}
  return (
    <div className='flex  flex-col gap-2 sm:mt-20 mt-10  justify-center items-center  sm:p-10 p-4 '>
       <div className='sm:text-xl text-2xl text-center text-sky-900'>Purchasing {order?.ticket?.title}</div>
       <div className="flex sm:flex-row flex-col gap-2 justify-center items-center">
    <div className='sm:text-[200px] text-[150px]'>
    ⏳
    </div>
    <div className='flex flex-col gap-5'>
        <div className="flex justify-center items-center">
    <div className='sm:text-6xl text-4xl text-[#fa3827]'>{timeleft}</div>
    <span>Seconds left to make payment</span>
    </div>
     <hr className='text-slate-300'/>
     <StripeCheckout 
        token={({id}) => postPayment.mutate({token:id,orderId:order.id})}
        stripeKey={stripe_key}
        amount={order?.ticket?.price * 100}
        email={user.email}
    />
    </div>
    </div>
</div>
  )
}

export default Show