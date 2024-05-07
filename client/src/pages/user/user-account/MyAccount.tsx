import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { signOut } from "../../../slices/user/userSlice";
import MyBooking from "./MyBooking";
import Profile from "./Profile";
import Loader from "../../../components/Loader";
import Error from "../../../components/Error";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const { currentUser, error, loading,token } = useAppSelector((data) => data.user);

  const [tab, setTab] = useState<string>("bookings");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const authToken = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  }

  const handleLogout = () => {
    dispatch(signOut());
  };

  const handleDelete = async() => {
    await axios.delete(`${BASE_URL}/user/${currentUser?._id}`,authToken)
    .then((res)=>{
      toast.success(res.data.message);
      dispatch(signOut())
      navigate('/login')
    })
    .catch((err)=>{
      toast.error(err.response.message)
    })
  }

  return (
    <section>
      {loading && !error && <Loader/>}
      {error && !loading && <Error errorMessage={error}/>}
      <div className="max-w-[1170px] px-5 mx-auto">
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="pb-[50px] px-[30px] rounded-md">
              <div className="flex items-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                  <img
                    src={currentUser?.photo}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </figure>
              </div>

              <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                  {currentUser?.name}
                </h3>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  Blood Type:
                  <span className="ml-2 text-headingColor text-[22px] leading-8">
                    o-
                  </span>
                </p>
              </div>
              <div className="mt-[50px] md:mt-[100px]">
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
                >
                  Logout
                </button>
                <button onClick={handleDelete} className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
                  Delete account
                </button>
              </div>
            </div>

            <div className="md:col-span-2 md:px-[30px]">
              <div>
                <button
                  onClick={() => setTab("bookings")}
                  className={`${
                    tab === "bookings" &&
                    "bg-primaryColor text-white font-normal"
                  }p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7
       border-solid border-primaryColor`}
                >
                  My Bookings
                </button>

                <button
                  onClick={() => setTab("settings")}
                  className={`${
                    tab === "settings" &&
                    "bg-primaryColor text-white font-normal"
                  }py-2  px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7
       border-solid border-primaryColor`}
                >
                  Profile Settings
                </button>
              </div>

              {tab === "bookings" && <MyBooking />}

              {tab === "settings" && <Profile />}
              
            </div>
            
          </div>
        )}
        
      </div>


    </section>
  );
};

export default MyAccount;
