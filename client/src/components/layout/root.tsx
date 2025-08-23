import { Outlet } from "react-router-dom";
import Header from "../header";

const Root = () => {
 
  return (
    <div className="flex flex-col">
    <Header/>
    <Outlet />

    </div>
  )
}

export default Root