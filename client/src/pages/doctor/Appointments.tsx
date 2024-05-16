import { useEffect, useState } from "react";

import axios from "axios";
import { BASE_URL } from "../../config";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAppointmentFailed,
  fetchAppointmentStart,
  fetchAppointmentSuccess,
} from "../../slices/doctor/appointmentSlice";
import { toast } from "react-toastify";
import { AiTwotoneLeftCircle, AiTwotoneRightCircle } from "react-icons/ai";
import { PiDotsThreeCircle } from "react-icons/pi";
import FullScreenModal from "../../components/FullScreenModal";
import AddPrescription from "../../components/doctor/AddPrescription";
import ViewPrescriptions from "../../components/doctor/ViewPrescriptions";
import { FcVideoCall } from "react-icons/fc";


import {
  fetchPrescriptionFailed,
  fetchPrescriptionStart,
  fetchPrescriptionSuccess,
  removeData,
} from "../../slices/prescription";

import { useNavigate } from "react-router-dom";
import convertTime from "../../utilis/convertTime";

const Appointments = () => {
  const { token } = useAppSelector((data) => data.doctor);

  const [query, setQuery] = useState<string | "">("");
  const [query1, setQuery1] = useState<string | "">("");
  const [debounceQuery, setDebounceQuery] = useState<string | "">("");
  const handleSearch = () => {
    setQuery(query.trim());
    
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const [openModalSchedule, setOpenModalSchedule] = useState<boolean>(false);
  const [timeChange, setTimeChange] = useState<string | "">("");
  const [userId, setUserId] = useState<string>("");
  const [name, setName] = useState<string | "">("");
  const [email, setEmail] = useState<string | "">("");
  const [status,setStatus] = useState<string | ''>('');
  const openModal = (user: string) => {
    setShowModal(true);
    setUserId(user);
   
  };

  const openScheduleModel = async (name: string, email: string) => {
    setOpenModalSchedule(true);
    setName(name);
    setEmail(email);
  };

  const closeScheduleModel = async () => {
    setOpenModalSchedule(false);
  };

  /*const closeModal = () => {
    setShowModal(false);
  };*/

  const { appointments } = useAppSelector(
    (state) => state.appointment
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage: number = 5;

  // Calculate index of first and last item for current page
  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;

  // Slice the doctors array to display only items for current page
  const currentDoctors = appointments.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  //total pages
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  // Handle next page button click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page button click
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { currentDoctor: doctor } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    const fetchPrescription = async () => {
      dispatch(fetchPrescriptionStart());
      await axios
        .get(
          `${BASE_URL}/prescription/getPrescription?userId=${userId}&doctorId=${doctor?._id}`,
          authToken
        )
        .then((res) => {
          const {  data } = res.data;
          dispatch(fetchPrescriptionSuccess(data));
        })
        .catch((err) => {
          dispatch(fetchPrescriptionFailed(err.response.message));
          //toast.error(err.response.data.message);
        });
    };
    fetchPrescription();
  }, [userId]);

  useEffect(() => {
    async function fetchAppointments() {
      dispatch(fetchAppointmentStart());
      await axios
        .get(
          `${BASE_URL}/doctors/getAppointments?query=${debounceQuery}`,
          authToken
        )
        .then((res: any) => {
          console.log('res-',res.data.data);
          dispatch(fetchAppointmentSuccess(res.data.data));
        })
        .catch((err) => {
          dispatch(fetchAppointmentFailed(err.response.data.message));
          toast.error(err.response.data.message);
        });
    }
    fetchAppointments();
  }, [debounceQuery == ""]);

  useEffect(() => {
    setQuery1("");
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
    }, 700);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    setQuery("");
    const timeout = setTimeout(() => {
      setDebounceQuery(query1);
    }, 700);
    return () => clearTimeout(timeout);
  }, [query1]);

  useEffect(() => {
    const fetchDoctorsWithSearch = async () => {
      dispatch(removeData());
      dispatch(fetchAppointmentStart());
      try {
        const res = await axios.get(
          `${BASE_URL}/doctors/getAppointments?query=${debounceQuery}`,
          {
            ...authToken,
            //params: { query: debounceQuery },
          }
        );
        const { data } = res?.data;
        console.log('datpa-'+data)

        dispatch(fetchAppointmentSuccess(data));
      } catch (err: any) {
        const { message } = err.response.data;
        dispatch(fetchAppointmentFailed(message));
        toast.error(message);
      }
    };

    if (debounceQuery !== "") {
      fetchDoctorsWithSearch();
    }
  }, [debounceQuery]);

  useEffect(() => {
    const fetchDoctorsWithStatus = async () => {
      dispatch(removeData());
      dispatch(fetchAppointmentStart());
      try {
        const res = await axios.get(
          `${BASE_URL}/doctors/getAppointments?status=${status}`,
          {
            ...authToken,
            //params: { query: debounceQuery },
          }
        );
        const { data } = res?.data;

        dispatch(fetchAppointmentSuccess(data));
      } catch (err: any) {
        const { message } = err.response.data;
        dispatch(fetchAppointmentFailed(message));
        toast.error(message);
      }
    };

    if (status !== "") {
      fetchDoctorsWithStatus();
    }
  }, [status]);

  const [add, setAdd] = useState<boolean>(false);

  const handleModalAction = (action: string) => {
    if (action === "add") {
      setAdd(true);
    } else if (action === "view") {
      setAdd(false);
    }
  };

  const handleTimeSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (timeChange == "") {
      return toast.error("please add the time");
    }

     let TimeChange = convertTime(timeChange);
    await axios
      .post(
        `${BASE_URL}/email1`,
        {
         timeChange: TimeChange,
          email,
          name,
        },
        authToken
      )
      .then((res) => {
        toast.success(res.data.message);
        setOpenModalSchedule(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div>
      <section className="bg-[#fff9ea] py-6 mt-[10px]">
        <div className="container mx-auto text-center flex flex-col md:flex-row items-center justify-center md:justify-between">
          <div className="max-w-[570px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between mb-4 md:mb-0 md:mr-4">
            <input
              type="search"
              className="py-3 pl-4 pr-2 bg-transparent w-full focus:outline cursor-pointer placeholder:text-textColor"
              placeholder="Search name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn mt-0 rounded-r-md" onClick={handleSearch}>
              Search
            </button>
          </div>
          <input
            type="date"
            name="date"
            value={query1}
            onChange={(e) => setQuery1(e.target.value)}
            className="py-3 pl-4 pr-2 bg-transparent  focus:outline cursor-pointer placeholder:text-textColor w-[200px]"
          />
        </div>
        <ul className="  flex  gap-2 mt-5 justify-center">
          <li>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-md">
              <input type="radio" name="filter" onClick={() => setStatus('All')}  />
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                All
              </p>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-md">
              <input type="radio" name="filter" onClick={() => setStatus('Upcoming')} />
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                Upcoming
              </p>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-md">
              <input type="radio" name="filter" onClick={() => setStatus('Completed')} />
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                Completed
              </p>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-md">
              <input type="radio" name="filter" onClick={() => setStatus('Cancelled')} />
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                Cancelled
              </p>
            </label>
          </li>
        </ul>
      </section>
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Gender
            </th>
            <th scope="col" className="px-6 py-3">
              Payment
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Booked on
            </th>
            <th scope="col" className="px-6 py-3">
              Meeting
            </th>
            <th scope="col" className="px-6 py-3">
              Records
            </th>
          </tr>
        </thead>

        <tbody>
          {currentDoctors?.map((item: any) => (
            <tr key={item._id}>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap
                "
              >
                <img
                  src={item.photo}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                
                <div className="pl-3">
                  <div className="text-base font-semibold">{item.name}</div>
                  <div className="text-normal text-gray-500">{item.email}</div>
                  {item.modeOfAppointment === "online" && (
                    <button
                      onClick={() => openScheduleModel(item.name, item.email)}
                      className="rounded-md bg-irisBlueColor w-28 h-8 mt-3"
                    >
                      Reschedule
                    </button>
                  )}
                </div>
              </th>
              <td className="px-6 py-4">{item.gender}</td>
              <td className="px-6 py-4">
                {item.isPaid && item.status === "cancelled" ? (
                  <div className="flex items-center">
                    <div className=" rounded-full text-red-500 mr-2">
                      cancelled
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className=" rounded-full text-green-500 mr-2">
                      Paid
                    </div>
                  </div>
                )}
                {!item.isPaid && (
                  <div className="flex items-center">
                    <div className=" rounded-full text-red-500 mr-2">
                      Unpaid
                    </div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{item.ticketPrice}</td>
              <td className="px-6 py-4">
                {" "}
                {new Date(item.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </td>
              <td className="px-6 py-4">
                {item.modeOfAppointment === "online" ? (
                  <FcVideoCall
                    size={30}
                    onClick={() =>
                      navigate(
                        `/doctor/videoCall?email=${item.email}&name=${item.name}`
                      )
                    }
                  />
                ) : (
                  <p>Offline</p>
                )}
              </td>
              <td className="px-6 py-4">
                <PiDotsThreeCircle
                  size={25}
                  color="black"
                  onClick={() => openModal(item._id)}
                />
              </td>


              {openModalSchedule && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Time Scheduling</h2>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={closeScheduleModel}
                      >
                        &times;
                      </button>
                    </div>
                    <div className="modal-content">
                      <form onSubmit={handleTimeSchedule}>
                        <p>Enter the time</p>
                        <input
                          type="time"
                          className="form__input"
                          onChange={(e) => setTimeChange(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-primaryColor w-full h-10 text-white mt-4"
                        >
                          Update
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </tr>
          ))}
        </tbody>
      </table>
             {showModal && <FullScreenModal
                showModal={showModal}
                setShowModal={setShowModal}
                doctor={true}
                onActionClick={handleModalAction}
              >
                {/* Modal content */}
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {add ? "Add pre" : "Patient Details"}
                </h3>
                {/* Add your modal content here */}
                {add ? (
                  <AddPrescription userId={userId} />
                ) : (
                  <ViewPrescriptions userId={userId} user={'admin'} />
                )}
              </FullScreenModal>}
      {/* Pagination buttons */}
      <div className="flex justify-center mt-10">
        <button
          className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
          onClick={handlePrevPage}
        >
          <AiTwotoneLeftCircle size={20} />
        </button>
        <p className="text-xl">
          {currentPage} / {totalPages}
        </p>
        <button
          className="bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300"
          onClick={handleNextPage}
        >
          <AiTwotoneRightCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default Appointments;
