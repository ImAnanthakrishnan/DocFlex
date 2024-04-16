import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks"


const PrivateRoute = () => {
    const {currentDoctor} = useAppSelector(state => state.doctor);
    return currentDoctor  ? <Outlet /> : <Navigate to='/doctor/login' />
}

export default PrivateRoute;