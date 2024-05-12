import Home from '../../pages/user/Home';
import Services from '../../pages/user/Services';
import Login from '../../pages/user/Login';
import Signup from '../../pages/user/Signup';
import Contact from '../../pages/user/Contact';
import Doctors from '../../pages/user/Doctors/Doctors';
import DoctorDetails from '../../pages/user/Doctors/DoctorDetails';

import {Routes,Route} from 'react-router-dom'
import Otp from '../../pages/user/Otp';
import PrivateRoute from '../../components/user/PrivateRoute';
import CheckoutSuccess from '../../pages/user/Doctors/CheckoutSuccess';
import MyAccount from '../../pages/user/user-account/MyAccount';
import EmailCheck from '../../components/EmailCheck';
import ForgotVerify from '../../components/ForgotVerify';
import ChatPage from '../../pages/ChatPage';
import Maps from '../../pages/user/Maps';
import Page404 from '../../pages/404';
const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/services' element={<Services />} />
        <Route path='/otp' element={<Otp/>}/>
        <Route element={<PrivateRoute />}>
        <Route path='/home' element={<Home />} />
        <Route path='/find-doctors' element={<Doctors />} />
        <Route path='find-doctors/:id' element={<DoctorDetails />} />
        <Route path='/checkout-success' element={<CheckoutSuccess />} />
        <Route path='/profile/me' element={<MyAccount />} />
        <Route path='/chats' element={<ChatPage />} />
        <Route path='/maps' element={<Maps />} />
        </Route>
        <Route path='/forgotVerify' element={<EmailCheck />} />
        <Route path='/reset' element={<ForgotVerify />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </div>
  )
}

export default Routers
