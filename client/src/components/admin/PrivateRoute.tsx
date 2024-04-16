import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks"


const PrivateRoute = () => {
    const {currentAdmin} = useAppSelector(state => state.admin);
    return currentAdmin ? <Outlet /> : <Navigate to='/admin' />
}

export default PrivateRoute