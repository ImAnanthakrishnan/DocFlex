import { useAppSelector } from "../../app/hooks";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import Routers from "../../routes/admin/Router";
import Login from '../../pages/admin/Login'
import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";

const Layout = () => {
  const [openSidebarToggle,setOpenSidebarToggle] = useState<boolean>(false);

  const openSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  }
  const {currentAdmin} = useAppSelector((data)=>data.admin);
  if(currentAdmin && location.pathname === '/admin'){
    return <Navigate to='/admin/home' />
  }
  return (
    <>
    {!currentAdmin ? (
      <Routes>
        <Route path="/admin" element={<Login />} />
      </Routes>
    ) : (
      <div
        style={{ backgroundColor: "rgb(242 250 248 )" }}
        className="grid-container"
      >
        {currentAdmin && <Header OpenSidebar={openSidebar} />}
        {currentAdmin && <Sidebar OpenSidebar={openSidebar}  openSidebarToggle={openSidebarToggle} />}
        <Routers />
      </div>
    )}
  </>
  );
};

export default Layout;
