import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import Tabs from "../../components/doctor/Tabs";

import StartIcon from '../../assets/images/Star.png';
import Profile from "../../pages/doctor/Profile";
import DoctorAbout from "../user/Doctors/DoctorAbout";
import Appointments from "./Appointments";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import { signOut } from "../../slices/doctor/doctorSlice";
import Experience from "./Experience";
import Education from "./Education";
import OnlineTimeSlots from "./OnlineTimeSlots";
import OfflineTimeSlots from "./OfflineTimeSlots";

const Dashboard = () => {

  const [tab, setTab] = useState<string>("overview");
  const location = useLocation();
  const [status,setStatus] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentDoctor,token } = useAppSelector(
    (state) => state.doctor
  );

  const authToken = {
    headers :{
      Authorization : `Bearer ${token}`
    }
  }

  useEffect(() => {

    const blocked = async() => {
      await axios.get(`${BASE_URL}/auth/blocked/${'doctor'}/${currentDoctor?._id}`,authToken)
      .then((res) => {
        const {is_blocked} = res.data;
        if(is_blocked){
            setStatus(true);
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
      })
    }
    blocked();

  },[]);

  if(status){
    dispatch(signOut());
    navigate('/doctor/login');
  }

  if(currentDoctor && location.pathname === '/' ){
    return <Navigate to="/doctor/home" />
  }


  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {/*loading && !error && <Loader />*/}
        {/*error && !loading && <Error />*/}

        
          <div className="grid lg:grid-cols-3 lg:gap-[50px]">
            <Tabs tab={tab} setTab={setTab} />

            <div className="lg:col-span-2">
              {currentDoctor?.isApproved === "pending" && (
                <div className="flext p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg">
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 00116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000
                2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    To get approval please complete your profile. We&apos;ll
                    review manually and verify your account.
                  </div>
                </div>
              )}

              <div className="mt-8">
                {tab === "overview" && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <figure className="max-w-[200px] mx-h-[200px]">
                        <img src={currentDoctor?.photo} alt="" className="w-full" />
                      </figure>
                      <div>
                        <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2
                        lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                          {currentDoctor?.specialization}
                        </span>
                        <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                          {currentDoctor?.name}
                        </h3>
                        <div className="flex items-center gap-[6px]">
                          <span className="flex items-center gap-[6px] text-headingColor text-[14px]
                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            <img src={StartIcon} alt="" />{currentDoctor?.averageRating}
                          </span>
                          <span className="text-textColor text-[14px]
                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            {(currentDoctor?.totalRating)}
                          </span>
                        </div>
                        <p className="text__para font-[15px] lg:max-w-[390px] leading-6">
                         {currentDoctor?.bio}
                        </p>
                      </div>
                    </div>
                    <DoctorAbout name={currentDoctor?.name} qualification={currentDoctor?.qualification} experience={currentDoctor?.experience} />
                  </div>
                )}
              </div>

                <div className="mt-8">
                  {tab === 'appointments' && <div><Appointments/></div>}
                  {tab === 'settings' && <div> <Profile /> </div>}
                  {tab === 'experience' && <div> <Experience /> </div>}
                  {tab === 'education' && <div> <Education /> </div>}
                  {tab === 'onlinetimeslots' && <div> <OnlineTimeSlots /> </div>}
                  {tab === 'offlinetimeslots' && <div> <OfflineTimeSlots /> </div>}
                </div>

              </div>
          </div>
       
      </div>
    </section>
  );
};

export default Dashboard;
