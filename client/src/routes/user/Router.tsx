import Home from '../../pages/user/Home';
import Services from '../../pages/user/Services';
import Login from '../../pages/user/Login';
import Signup from '../../pages/user/Signup';
import Contact from '../../pages/user/Contact';
import Doctors from '../../pages/user/Doctors/Doctors';
import DoctorDetails from '../../pages/user/Doctors/DoctorDetails';

import {Routes,Route} from 'react-router-dom'
const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='doctors/:id' element={<DoctorDetails />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/services' element={<Services />} />
      </Routes>
    </div>
  )
}

export default Routers
