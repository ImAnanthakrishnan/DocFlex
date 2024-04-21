import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiTwotoneLeftCircle, AiTwotoneRightCircle } from "react-icons/ai";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import axios from "axios";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import {
    fetchPrescriptionFailed,
    fetchPrescriptionStart,
    fetchPrescriptionSuccess,
  } from "../../slices/prescription";
import Loader from "../Loader";
import Error from "../Error";
type PropsType = {
  userId?: string;
};

const ViewPrescriptions = ({ userId }: PropsType) => {

    const [query, setQuery] = useState<string | "">("");
    const [debounceQuery, setDebounceQuery] = useState<string | "">("");
   const dispatch = useAppDispatch();
   const { prescription,loading,error } = useAppSelector((state) => state.prescription);
  console.log('p-',prescription)
   const [currentPage, setCurrentPage] = useState<number>(1);

   const itemsPerPage: number = 3;

     // Calculate index of first and last item for current page
  const indexOfLastPrescription = currentPage * itemsPerPage;
  const indexOfFirstPrescription = indexOfLastPrescription - itemsPerPage;

    // Slice the doctors array to display only items for current page
    const currentPrecription = prescription.slice(
      indexOfFirstPrescription,
      indexOfLastPrescription
    );

    
  //total pages
  const totalPages = Math.ceil(prescription.length / itemsPerPage);
  

  
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

  /* const { token,currentDoctor } = useAppSelector((data) => data.doctor);

   const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    // setQuery1('');
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
    }, 700);
    return () => clearTimeout(timeout);
  }, [query]);

    useEffect(() => {
   
        const fetchPrescription = async () => {
          dispatch(fetchPrescriptionStart());
            await axios.get(`${BASE_URL}/prescription/getPrescription?userId=${userId}&doctorId=${currentDoctor?._id}&query=${debounceQuery}`,authToken)
            .then((res)=>{
              const {message,data} = res.data;
              dispatch(fetchPrescriptionSuccess(data));
            })
            .catch((err)=>{
              dispatch(fetchPrescriptionFailed(err.response.message));
              //toast.error(err.response.data.message);
            })
        };
        fetchPrescription();
      }, [debounceQuery]);*/

    

 

  return (
    <div>
              <section className="bg-[#fff9ea] py-6 mt-[10px]">
        <div className="container mx-auto text-center flex flex-col md:flex-row items-center justify-center md:justify-between">
          <input
            type="date"
            name="date"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="py-3 pl-4 pr-2 bg-transparent  focus:outline cursor-pointer placeholder:text-textColor w-[200px]"
          />
        </div>
      </section>
      {loading && !error && <Loader/>}
      {error && !loading && <Error errorMessage={error} />}
      {!loading && !error && currentPrecription.map((item, index) => (
        <div
          key={index}
          className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
          {
            <Swiper
              modules={[Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
            >
              {item.testReports.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <img className="rounded-t-lg" src={item.img} alt="" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          }

          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Symptoms : {item.symptoms}
            </h5>

            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Disease : {item.disease}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.medicines.map((medItem, medIndex) => (
                <div key={medIndex}>
                  <button
                    disabled
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black bg-gray-300 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {medItem.name} x {medItem.quantity}
                  </button>
                </div>
              ))}
            </div>
            <div className="text-grey-200 float-right">
          <span className="text-black">Booked on : </span> {new Date(item.createdAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
            </div>
          </div>
        </div>
      ))}
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

export default ViewPrescriptions;