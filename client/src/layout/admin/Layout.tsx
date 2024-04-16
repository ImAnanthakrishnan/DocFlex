import { useAppSelector } from "../../app/hooks";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import Routers from "../../routes/admin/Router";
import Login from '../../pages/admin/Login'
import { Navigate, Route, Routes } from "react-router-dom";

const Layout = () => {
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
        {currentAdmin && <Header />}
        {currentAdmin && <Sidebar />}
        <Routers />
      </div>
    )}
  </>
  );
};

export default Layout;
