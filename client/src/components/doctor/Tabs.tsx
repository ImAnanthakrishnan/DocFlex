import { BiMenu } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signOut } from "../../slices/doctor/doctorSlice";

type propsType = {
  tab: string;
  setTab: (value: string) => void;
};

const Tabs = ({ tab, setTab }: propsType) => {
    const {token} = useAppSelector((data) => data.doctor);
    let navigate = useNavigate();

    let dispatch = useAppDispatch();
    const handleLogout =( )=>{
        dispatch(signOut());
        navigate('/doctor/login')
    }

  return (
    <div>
      <span className="lg:hidden">
        <BiMenu className="w-6 h-6 cursor-pointer" />
      </span>
      <div className="hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md">
        <button
        onClick={()=>setTab('overview')}
          className={`${
            tab === "overview"
              ? "bg-indigo-400 text-primaryColor"
              : "bg-transparent text-headingColor"
          }w-full btn mt-0 rounded-md`}
        >
        <p className="text-headingColor"> Overview</p> 
        </button>
        <button
       onClick={()=>setTab('appointments')}
          className={`${
            tab === "appointments"
              ? "bg-indigo-400 text-primaryColor"
              : "bg-transparent text-headingColor"
          }w-full btn mt-0 rounded-md`}
        >
         <p className="text-headingColor"> Appointments</p> 
        </button> 
        <button
        onClick={()=>setTab('settings')}
          className={`${
            tab === "settings"
              ? "bg-indigo-400 text-primaryColor"
              : "bg-transparent text-headingColor"
          }w-full btn mt-0 rounded-md`}
        >
          <p className="text-headingColor"> Profile</p> 
        </button>

          <div className="mt-[100px] w-full">
            <button onClick={handleLogout}
            className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white">
                Logout
            </button>
          </div>

      </div>
    </div>
  );
};

export default Tabs;
