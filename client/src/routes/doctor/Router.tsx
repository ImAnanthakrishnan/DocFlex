import JitsiMeet from '../../components/JitsiMeet';
import PrivateRoute from '../../components/doctor/PrivateRoute';
import ChatPage from '../../pages/ChatPage';
import Dashboard from '../../pages/doctor/Dashboard';
import Login from '../../pages/doctor/Login';

import Signup from '../../pages/doctor/Signup';

import {Routes,Route} from 'react-router-dom'


const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path='/doctor/register' element={<Signup />} />
        <Route path='/doctor/login' element={<Login />}/>
        <Route element = {<PrivateRoute />}>
        <Route path='/doctor/home' element={<Dashboard/>}/>
        <Route path='/doctor/videoCall' element={<JitsiMeet/>} />
        <Route path='/doctor/chat' element={<ChatPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default Routers
