import { loader1, logo } from '../assets/images'

const Loader = () => {
  return (
    <div className='fixed inset-0 z-10 h-screen flex items-center justify-center flex-flex'>
      <div className='flex flex-col items-center justify-center gap-5'>
      <img className="h-8" src={logo} alt="" />
      <img src={loader1} alt="" />
      </div>
    </div>
  )
}

export default Loader