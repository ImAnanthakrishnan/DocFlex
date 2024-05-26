import { useAppDispatch, useAppSelector } from "../app/hooks";
import { signOut as userSignOut } from "../slices/user/userSlice";
import { signOut as doctorSignOut } from "../slices/doctor/doctorSlice";
import { signOut as adminSignOut } from "../slices/admin/adminSlice";

const Error = ({ errorMessage }: any) => {
  let { currentUser } = useAppSelector((state) => state.user);
  let { currentDoctor } = useAppSelector((state) => state.doctor);
  let { currentAdmin } = useAppSelector((state) => state.admin);

  let dispatch = useAppDispatch();

  const handleSignout = () => {
    if (currentUser) {
      dispatch(userSignOut());
    } else if (currentDoctor) {
      dispatch(doctorSignOut());
    } else if (currentAdmin) {
      dispatch(adminSignOut());
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h3 className="text-headingColor text-[20px] leading-[30px] font-semibold">
          {errorMessage}
        </h3>
        <br />
        <button
          className="btn bg-irisBlueColor rounded-md mt-4"
          onClick={handleSignout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Error;
