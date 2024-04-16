import logo from "../../assets/images/Screenshot (257).png";
import { MdHealthAndSafety } from "react-icons/md";
import { FaUserDoctor,FaHospitalUser } from "react-icons/fa6";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    
      <aside id="sidebar" className="hidden md:block">
        <div className="sidebar-title">
          <div className="sidebar-brand">
          <img src={logo} alt="" className="h-12 w-12" />  Admin
          </div>
          <span className="icon close_icon">X</span>
        </div>
        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            <Link to="/admin/home">
              <MdHealthAndSafety color="rgb(102 181 163)" className="icon"/> <span>Dashboard</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/admin/doctors" >
              <FaUserDoctor color="rgb(102 181 163)" className="icon"/> Doctors
            </Link>
          </li>
          <li className="sidebar-list-item">
          <Link to="/admin/users" >
              <FaHospitalUser color="rgb(102 181 163)" className="icon"/> Patients
            </Link>
          </li>
          <li className="sidebar-list-item">
            <a href="">
              <BsMenuButtonWideFill color="rgb(102 181 163)" className="icon"/> Reports
            </a>
          </li>
        </ul>
      </aside>
    
  )
}

export default Sidebar
