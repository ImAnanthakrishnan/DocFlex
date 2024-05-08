import  { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { BsJustify, BsSearch, BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signOut } from '../../slices/admin/adminSlice';

type PropsType = {
  OpenSidebar : ()=>void;
}

const Header = ({OpenSidebar}:PropsType) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { currentAdmin } = useAppSelector((data) => data.admin);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    dispatch(signOut());
   // localStorage.removeItem('doctorBlockStatus');
   // localStorage.removeItem('userBlockStatus');
    navigate('/admin')
   handleDropdownToggle()
  };

  return (
    <header className="admin-header hidden md:flex">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <BsSearch className="icon" />
      </div>
      <div className="header-right flex">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <div className="relative">
          <div className="cursor-pointer" onClick={handleDropdownToggle}>
          {currentAdmin ? (
              <div className="relative">
                <div className="cursor-pointer" onClick={handleDropdownToggle}>
                 
                    <figure className="w-[35px] h-[35px] rounded-full">
                      <img
                        src={currentAdmin?.photo}
                        className="w-full rounded-full"
                        alt=""
                      />
                    </figure>
                 
                </div>
              </div>
            ) :
            <BsPersonCircle className="icon" />}
          </div>
          {showDropdown && (
            <div className="absolute top-10 right-0 bg-white shadow-md rounded-md">
              <button onClick={handleLogout} className="block w-full py-2 px-4 text-left hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
