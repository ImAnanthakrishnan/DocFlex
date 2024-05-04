import { BiMenu } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signOut } from "../../slices/doctor/doctorSlice";
import { useState } from "react";

type propsType = {
  tab: string;
  setTab: (value: string) => void;
};

const Tabs = ({ tab, setTab }: propsType) => {

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const {token} = useAppSelector((data) => data.doctor);
    let navigate = useNavigate();

    let dispatch = useAppDispatch();
    const handleLogout =( )=>{
        dispatch(signOut());
        navigate('/doctor/login')
    }

    const handleButtonClick = (selectedTab:string) => {

      if(tab === selectedTab){
        setShowDropdown(!showDropdown);
      } else {
        setTab(selectedTab);
        setShowDropdown(true);
      }

    }

    const handleTabChange = (selectedTab:string) => {
      setTab(selectedTab)
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
        onClick={()=>handleButtonClick('settings')}
          className={`${
            tab === "settings"
              ? "bg-indigo-400 text-primaryColor"
              : "bg-transparent text-headingColor"
          }w-full btn mt-0 rounded-md`}
        >
          <p className="text-headingColor"> Profile</p> 
        </button>
       
        {showDropdown && (
        <div className=" w-[115px] bg-white border border-gray-200 shadow-lg rounded-md">
          <ul className="py-1">
            <li
              onClick={() => handleTabChange('education')}
             className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Education
            </li>
            <li
             onClick={() => handleTabChange('experience')}
             className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Experience
            </li>
            <li
             onClick={() => handleTabChange('offlinetimeslots')}
             className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Offline Time Slots
            </li>
            <li
            onClick={() => handleTabChange('onlinetimeslots')}
             className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Online Time Slots
            </li>
          </ul>
        </div>
      )}
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
