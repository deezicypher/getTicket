
import Header from '../components/header'
import Hero from '../components/hero'
import List from './tickets/HomeTicketList'

const Home = () => {
  
  return (
    <div className="flex flex-col">
    <Header/>
    <Hero/>
    <List/>
  </div>
  )
}

export default Home