import "./App.css";
import UserLayout from "./layout/user/Layout";
import DoctorLayout from "./layout/doctor/Layout";
import AdminLayout from "./layout/admin/Layout";
import { useLocation } from "react-router-dom";

function App() {

  const location = useLocation();

  const getRole = () => {
    if(location.pathname.startsWith('/admin')){
      return 'admin';
    }else if(location.pathname.startsWith('/doctor')){
      return 'doctor'
    }

    return 'user';
  }
  const role = getRole();
  return (
    <>
     {role === 'user' ? <UserLayout /> : role === 'doctor' ? <DoctorLayout /> : <AdminLayout />}
    </>
  );
}

export default App;
