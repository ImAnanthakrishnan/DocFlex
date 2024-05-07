import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../config";
import { useAppSelector } from "../../../app/hooks";
import { useDispatch } from "react-redux";
import {
  fetchDoctorStart,
  fetchDoctorListSuccess,
  fetchDoctorListFailed,
  clear,
} from "../../../slices/user/doctorListSlice";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import Error from "../../../components/Error";
import DoctorCard from "../../../components/doctor/DoctorCard";
import { AiTwotoneLeftCircle, AiTwotoneRightCircle } from "react-icons/ai";

const MyBooking = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage: number = 5;

  const [query, setQuery] = useState<string | "">("");
  const [query1, setQuery1] = useState<string | "">("");
  const [debounceQuery, setDebounceQuery] = useState<string | "">("");
  const [status,setStatus] = useState<string | ''>('');
  const handleSearch = () => {
    setQuery(query.trim());
  };

  const { approvedDoctorList, loading, error } = useAppSelector(
    (data) => data.approvedDoctorList
  );

  // Calculate index of first and last item for current page
  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;

  // Slice the doctors array to display only items for current page
  const currentDoctors = approvedDoctorList.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  //total pages
  const totalPages = Math.ceil(approvedDoctorList.length / itemsPerPage);

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

  const { token, currentUser } = useAppSelector((data) => data.user);

  const dispatch = useDispatch();
  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    async function fetchBookings() {
      dispatch(clear());
      dispatch(fetchDoctorStart());
      await axios
        .get(
          `${BASE_URL}/user/appointments/my-appointments?query=${debounceQuery}`,
          authToken
        )
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
    fetchBookings();
  }, [debounceQuery == ""]);

  useEffect(() => {
    // setQuery1('');
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
    }, 700);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    //setQuery('')
    const timeout = setTimeout(() => {
      setDebounceQuery(query1);
    }, 700);
    return () => clearTimeout(timeout);
  }, [query1]);

  useEffect(() => {
    const fetchDoctorsWithSearch = async () => {
      dispatch(fetchDoctorStart());
      try {
        const res = await axios.get(
          `${BASE_URL}/user/appointments/my-appointments?query=${debounceQuery}`,
          {
            ...authToken,
            //params: { query: debounceQuery },
          }
        );
        const { data } = res?.data;

        dispatch(fetchDoctorListSuccess(data));
      } catch (err: any) {
        const { message } = err.response.data;
        dispatch(fetchDoctorListFailed(message));
        toast.error(message);
      }
    };

    if (debounceQuery !== "") {
      fetchDoctorsWithSearch();
    }
  }, [debounceQuery]);

  useEffect(() => {
    const fetchDoctorsWithStatus = async () => {
      dispatch(fetchDoctorStart());
      try {
        const res = await axios.get(
          `${BASE_URL}/user/appointments/my-appointments?status=${status}`,
          {
            ...authToken,
            //params: { query: debounceQuery },
          }
        );
        const { data } = res?.data;

        dispatch(fetchDoctorListSuccess(data));
      } catch (err: any) {
        const { message } = err.response.data;
        dispatch(fetchDoctorListFailed(message));
        toast.error(message);
      }
    };

    if(status !== ""){
      fetchDoctorsWithStatus();
    }
  
  },[status]);

  return (
    <div>
      <section className="bg-[#fff9ea] py-6 mt-[10px]">
        <div className="container mx-auto text-center flex flex-col md:flex-row items-center justify-center md:justify-between">
          <div className="max-w-[570px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between mb-4 md:mb-0 md:mr-4">
            <input
              type="search"
              className="py-3 pl-4 pr-2 bg-transparent w-full focus:outline cursor-pointer placeholder:text-textColor"
              placeholder="Search appointments by name or specification"
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
        <ul className="  flex md:float-right flex-col gap-2 mt-5 justify-center">
          <li>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-md">
              <input type="radio" name="filter" onClick={() => setStatus('All')} />
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                All
              </p>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-md">
              <input type="radio" name="filter" onClick={() => setStatus('Upcoming')}/>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                Upcoming
              </p>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-md">
              <input type="radio" name="filter" onClick={() => setStatus('Completed')}/>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                Completed
              </p>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-md">
              <input type="radio" name="filter" onClick={() => setStatus('Cancelled')}/>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                Cancelled
              </p>
            </label>
          </li>
        </ul>
      </section>

      {loading && !error && <Loader />}
      {error && !loading && <Error errorMessage={error} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {currentDoctors.map((doctor,index) => (
            <DoctorCard key={index} doctor={doctor} booking={true} />
          ))}
        </div>
      )}

      {!loading && !error && approvedDoctorList.length === 0 && (
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
          You did not book any doctor yet!
        </h2>
      )}
      {/* Pagination buttons */}
      <div className="flex justify-center mt-10">
        <button
          className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
          onClick={handlePrevPage}
        >
          <AiTwotoneLeftCircle size={20} />
        </button>
        <p className="text-2xl">
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

export default MyBooking;
