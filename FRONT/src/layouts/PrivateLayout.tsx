import { Outlet } from "react-router-dom";
import { NavigationBar } from "../components/Navbar";

//ajouter deconnection
export const PrivateLayout = () => {


  return (
    <>
    
     <header>
        <NavigationBar/>
      </header>

      <Outlet />
    </>
  );
};

