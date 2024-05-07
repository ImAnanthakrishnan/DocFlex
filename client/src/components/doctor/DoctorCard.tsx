import { FaArrowRight } from "react-icons/fa6";
import { doctors } from "../../assets/doctors";
import StartIcon from "../../assets/images/Star.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import convertTime from "../../utilis/convertTime";

import FullScreenModal from "../FullScreenModal";
import ViewPrescriptions from "./ViewPrescriptions";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";

import {
  fetchPrescriptionFailed,
  fetchPrescriptionStart,
  fetchPrescriptionSuccess,
  removeData,
} from "../../slices/prescription";
import axios from "axios";
import { BASE_URL } from "../../config";
import Review from "../user/Review";
import { toast } from "react-toastify";
import {
  clear,
  fetchDoctorListSuccess,
  fetchDoctorStart,
} from "../../slices/user/doctorListSlice";
import { ImLocation2 } from "react-icons/im";

type Doctor = {
  doctor: {
    _id: string | number;
    name: string;
    specialization: string;
    avgRating: number;
    totalRating: number;
    photo: string;
    totalPatients: number;
    hospital: string;
    experience: string[];
  };
};

const DoctorCard = ({ doctor, booking }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLocationModal,setShowLocationModal] = useState<boolean>(false)
  const openModal = () => {
    setShowModal(true);
  };

  const openLocationModal = () => {
   setShowLocationModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const closeLocationModal = () => {
    setShowLocationModal(false)
  }

  const { token, currentUser } = useAppSelector((data) => data.user);

  const dispatch = useDispatch();
  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const {
    _id,
    name,
    averageRating,
    totalRating,
    photo,
    specialization,
    experience,
    createdAt,
    appointmentDate,
    status,
    bookingId
  } = doctor;

  const [cancel, setCancel] = useState<string | "">("");

  const { singleDoctor } = useAppSelector((data) => data.singleDoctor);

  const handleCancel = async () => {
    setCancel("cancel");
    try {
      const response = await axios.get(
        `${BASE_URL}/bookings/cancel?bookingId=${bookingId}`,
        authToken
      );
      toast.success(response.data.message);
      setCancel("");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/wallet/credit`,
        { userId: currentUser?._id, cash: doctor.ticketPrice,doctorId:_id },
        authToken
      );
      // toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  let showCancelButton = null;

  if (booking) {
    /*useEffect(() => {
      const fetchPrescription = async () => {
        dispatch(fetchPrescriptionStart());
        await axios
          .get(
            `${BASE_URL}/prescription/getPrescription?userId=${currentUser?._id}&doctorId=${_id}`,
            authToken
          )
          .then((res: any) => {
            const { message, data } = res.data;
            console.log("data-", data);
            dispatch(fetchPrescriptionSuccess(data));
          })
          .catch((err) => {
            dispatch(fetchPrescriptionFailed(err.response.message));
            //toast.error(err.response.data.message);
          });
      };
      fetchPrescription();
    }, []);*/

    /*useEffect(() => {
    const fetchPrescription = async () => {
      dispatch(fetchPrescriptionStart());
        await axios.get(`${BASE_URL}/prescription/getPrescription?userId=${currentUser?._id}&doctorId=${_id}&createdAt=${createdAt}`,authToken)
        .then((res:any)=>{
          const {message,data} = res.data;
          console.log('data-',data)
          dispatch(fetchPrescriptionSuccess(data));
        })
        .catch((err)=>{
          dispatch(fetchPrescriptionFailed(err.response.message));
          //toast.error(err.response.data.message);
        })
    };
    fetchPrescription();
  },[]);*/

    const appointment = new Date(appointmentDate?.date);
    const currentDate = new Date();

    console.log('apdate-',appointment);
    console.log('curreda-',currentDate);

    showCancelButton = appointment > currentDate;

    console.log(showCancelButton)

    useEffect(() => {
      async function fetchBookings() {
        dispatch(clear());
        dispatch(fetchDoctorStart());
        await axios
          .get(`${BASE_URL}/user/appointments/my-appointments`, authToken)
          .then((res: any) => {
            const { data, message } = res.data;
            console.log("data-", data);

            dispatch(fetchDoctorListSuccess(data));
          })
          .catch((err: any) => {
            const { message } = err.response;
            toast.error(message);
          });
      }
      if (cancel !== "") {
        fetchBookings();
      }
    }, [cancel]);
  }

  const [review, setReview] = useState<boolean>(false);

  const handleModalAction = (action: string) => {
    if (action === "review") {
      setReview(true);
    } else {
      setReview(false);
    }
  };
  const [download,setDownload] = useState<any>('');
  const handleRefAction = (action:any) => {
    setDownload(action);
  }
  const { prescription } = useAppSelector((state) => state.prescription);

  return (
    <div className="p-3 lg:p-5">
      <img src={photo} className="w-full" alt="" />

      <h2
        className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor
    font-[700] mt-3 lg:mt-5"
      >
        {name}
      </h2>
      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span
          className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 
        lg:text-[16px] lg:leading-7 font-semibold rounded"
        >
          {specialization}
        </span>
        <div className="flex items-center gap-[6px]">
          <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
            <img src={StartIcon} alt="" /> {averageRating}
          </span>

          <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-400 text-textColor">
            ({totalRating})
          </span>
        </div>
      </div>
      <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
        <div>
          {/* <h3 className="text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor">
                +{totalPatients} patients
  </h3> */}
          <p className="text-[14px] leading-6 font-[400] text-textColor cursor-pointer" onClick={openLocationModal}>
            At {experience && experience?.[0]?.hospital}
          </p>
          {showLocationModal && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold mb-5">Location for meeting</h2>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={closeLocationModal}
                      >
                        &times;
                      </button>
                    </div>
                    <div className="modal-content">
                  <div className="flex gap-2"> <ImLocation2 color="red" size={25} /> <span className="text-irisBlueColor font-semibold">{experience && experience?.[0]?.hospital}</span></div> 
                    </div>
                  </div>
                </div>
              )}
          {booking && (
            <p className="text-sm mt-3 bg-transparent">
              {new Date(doctor.createdAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                // hour: "numeric",
                // minute: "numeric",
                // hour12: true,
              })}
            </p>
          )}
        </div>

        {booking && booking ? (
          <div className="flex flex-col gap-4">
            <button
              className="rounded bg-primaryColor text-white w-[35px] h-[35px] px-2"
              onClick={openModal}
            >
              <FiEye size={20} />
            </button>
            {showCancelButton && status === 'approved' &&
              <button
                className="bg-slate-200 rounded-lg border-t-neutral-300 w-20 h-10 hover:bg-red-300 border-b-teal-50"
                onClick={handleCancel}
              >
                Cancel
              </button>
            }
           {status === 'cancelled' && <p className="text-headingColor text-center">Cancelled</p>}
          </div>
        ) : (
          <Link
            to={`/find-doctors/${_id}`}
            className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-30px mx-auto flex item-center justify-center group hover:bg-primaryColor hover:border-none"
          >
            <FaArrowRight className="group-hover:text-white w-6 h-6 mt-2 " />
          </Link>
        )}
        {/* Modal */}
        <FullScreenModal
          showModal={showModal}
          setShowModal={setShowModal}
          doctor={false}
          onActionClick={handleModalAction}
          onActionRef = {handleRefAction}
        >
          {/* Modal content */}
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {review ? "Add Review" : "Prescription Details"}
          </h3>
          {/* Add your modal content here */}
          {review ? <Review doctorId={_id} /> : <ViewPrescriptions doctorId={_id} userId={currentUser?._id} user={'patient'} download={download} />}
        </FullScreenModal>
      </div>
    </div>
  );
};

export default DoctorCard;
