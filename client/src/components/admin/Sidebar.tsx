import logo from "../../assets/images/Screenshot (257).png";
import { MdHealthAndSafety } from "react-icons/md";
import { FaUserDoctor,FaHospitalUser } from "react-icons/fa6";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { Link } from "react-router-dom";
type propsType = {
  openSidebarToggle:boolean;
  OpenSidebar : ()=>void;
}
const Sidebar = ({openSidebarToggle,OpenSidebar}:propsType) => {
  return (
    
      <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive":""}>
        <div className="sidebar-title">
          <div className="sidebar-brand">
          <img src={logo} alt="" className="h-12 w-12" />  Admin
          </div>
          <span className="icon close_icon" onClick={OpenSidebar}>X</span>
        </div>
        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            <Link to="/admin/home">
              <MdHealthAndSafety color="rgb(102 181 163)" className="icon"/> Dashboard
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
            <Link to="/admin/reports">
              <BsMenuButtonWideFill color="rgb(102 181 163)" className="icon"/> Reports
            </Link>
          </li>
        </ul>
      </aside>
    
  )
}

export default Sidebar
