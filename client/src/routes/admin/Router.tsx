
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../../pages/admin/Dashboard'
import Doctors from '../../pages/admin/Doctor'
import Login from '../../pages/admin/Login'
import PrivateRoute from '../../components/admin/PrivateRoute'
import Users from '../../pages/admin/User'
import DoctorView from '../../pages/admin/DoctorView'
import Reports from '../../pages/admin/Reports'

const Routers = () => {
  return (
    <>
      <Routes>
        <Route element = {<PrivateRoute />}>
        <Route path='/admin/home' element={<Dashboard />} />
        <Route path='/admin/doctors' element={<Doctors />}/>
        <Route path='/admin/doctors/view' element = {<DoctorView/>} />
        <Route path='/admin/users' element={<Users />} />
        <Route path='/admin/reports' element={<Reports />} />
        </Route>
      </Routes>
    </>
  )
}

export default Routers
