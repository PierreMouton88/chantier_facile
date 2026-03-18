import { Outlet } from "react-router-dom";
import {NavigationBar} from '../components/Navbar';

export const PublicLayout= () =>{
    return (
      <div className="">
        <header>
            <NavigationBar/>
            
        </header>
          <Outlet/>    
      </div>
    )
}


