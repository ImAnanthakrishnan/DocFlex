import  { useEffect, useState } from "react";

import starIcon from "../../../assets/images/Star.png";
import DoctorAbout from "./DoctorAbout";
import Feedback from "./Feedback";
import SidePanel from "./SidePanel";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Failure, Start, Success } from "../../../slices/doctorSlice";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import Error from "../../../components/Error";
const DoctorDetails = () => {
  const { id } = useParams();
  
  const dispatch = useAppDispatch();

  const { token } = useAppSelector((data) => data.user);

  const { loading, singleDoctor, error } = useAppSelector(
    (data) => data.singleDoctor
  );

  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    async function fetchDoctor() {
      dispatch(Start());

      await axios
        .get(`${BASE_URL}/doctors/getSingleDoctor/${id}`, authToken)
        .then((res) => {
          console.log(res?.data);
          const { data } = res?.data;
          dispatch(Success(data));
        })
        .catch((err) => {
          const { message } = err.response.data;
          toast.error(message);
          dispatch(Failure(message));
        });
    }
    fetchDoctor();
  }, []);

  const [tab, setTab] = useState<string>("about");
  return (
    <section>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error errorMessage={error} />
      ) : (
        <div className="max-w-[1170px] px-5 mx-auto">
          <div className="grid md:grid-cols-3 gap-[50px]">
            <div className="md:col-span-2">
              <div className="flex items-center gap-5">
                <figure className="max-w-[200px] max-h-[200px]">
                  <img src={singleDoctor?.photo} alt="" className="w-full" />
                </figure>
                <div>
                  <span
                    className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px]
            leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded"
                  >
                    {singleDoctor?.specialization}
                  </span>
                  <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                    {singleDoctor?.name}
                  </h3>

                  <div className="flex items-center gap-[6px]">
                    <span
                      className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px]
            lg:leading-7 font-semibold text-headingColor"
                    >
                      <img src={starIcon} alt="" />
                      {singleDoctor?.averageRating}
                    </span>
                    <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
                      {singleDoctor?.totalRating}
                    </span>
                  </div>
                  <p className="text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px]">
                    {singleDoctor?.bio}
                  </p>
                </div>
              </div>

              <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
                <button
                  className={`${
                    tab === "about" &&
                    "border-b border-solid border-primaryColor"
                  } py-2 px-5 mr-5 text-[16px] leading-7 text-heaingColor font-semibold `}
                  onClick={() => setTab("about")}
                >
                  About
                </button>
                <button
                  onClick={() => setTab("feedback")}
                  className={`${
                    tab === "feedback" &&
                    "border-b border-solid border-primaryColor"
                  } py-2 px-5 mr-5 text-[16px] leading-7 text-heaingColor font-semibold `}
                >
                  Feedback
                </button>
              </div>

              <div className="mt-[50px]">
                {tab === "about" && (
                  <DoctorAbout
                    name={singleDoctor?.name}
                    qualification={singleDoctor?.qualification}
                    experience={singleDoctor?.experience}
                  />
                )}
                {tab === "feedback" && <Feedback reviews={singleDoctor?.reviews} totalRating={singleDoctor?.totalRating} doctorId={singleDoctor?._id} />}
              </div>
            </div>

            <div>
              <SidePanel
                doctorId={singleDoctor?._id}
                ticketPrice={singleDoctor?.ticketPrice}
                extraCharges = {singleDoctor?.extraCharges}
                timeSlots={singleDoctor?.timeSlots}
                onlineSlots={singleDoctor?.onlineTimeSlots}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DoctorDetails;
