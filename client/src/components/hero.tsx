import { girl } from "../assets/images"

const Hero = () => {
  return (
    <div>
        <div className='sm:p-10 p-4'>
    <div className='from-red-500 to-red-900 text-white bg-gradient-to-r rounded-xl w-full min-h-100 sm:p-10 p-4'>
        <div className='flex sm:flex-row flex-col justify-between xl:justify-center xl:gap-96 items-center '>
<div className='flex flex-col'>
<h1 className='xl:text-6xl text-2xl '>
            Get Your Tickets Here!
        </h1>
        <div className='xl:text-9xl text-6xl'>
            30% Discount.
        </div>
        <div className='sm:text-2xl text-xl'>Limited Offer. Streamlined for easy access and affordability </div>

        <div className='mt-5 bg-gradient-to-r from-[#408ffe] to-[#1764f4] rounded-xl sm:py-2 sm:px-6 px-4 py-2 xl:px-10 xl:py-4 sm:text-2xl  text-base  w-max'>
            Buy Now
        </div>
</div>

<div className='flex w-50 h-70 sm:w-max sm:h-max'>
    
    <img src={girl} alt="" className="" height={400} width={400} />

</div>
        </div>
        
    </div>
</div>
    </div>
  )
}

export default Hero