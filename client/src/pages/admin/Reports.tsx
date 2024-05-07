import React, { useEffect, useState, useRef } from "react";
import { AiTwotoneLeftCircle, AiTwotoneRightCircle } from "react-icons/ai";
import Loader from "../../components/Loader";
import { BsThreeDots } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAppointmentFailed, fetchAppointmentStart, fetchAppointmentSuccess } from "../../slices/doctor/appointmentSlice";
import { BASE_URL } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import { removeData } from "../../slices/prescription";
import Error from "../../components/Error";
import {useReactToPrint} from 'react-to-print'
import { FaFilePdf } from "react-icons/fa6";
import { background } from "@chakra-ui/react";

const Reports = () => {

  const [query, setQuery] = useState<string | "">("");
  const [query1, setQuery1] = useState<string | "">("");
  const [debounceQuery, setDebounceQuery] = useState<string | "">("");
  const [status,setStatus] = useState<string | ''>('');
  const handleSearch = () => {
    setQuery(query.trim());
  };

  const componentPdf = useRef<any>(0);

  const {token} = useAppSelector(data=>data.admin);

  const dispatch = useAppDispatch();

  const { appointments, loading, error } = useAppSelector(
    (state) => state.appointment
  );

  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage: number = 5;

  // Calculate index of first and last item for current page
  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;

  // Slice the doctors array to display only items for current page
  const currentReports = appointments.slice(
    indexOfFirstReport,
    indexOfLastReport
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
    headers:{
      Authorization:`Bearer ${token}`
    }
  }

  useEffect(() => {
    async function fetchAppointments() {
      dispatch(fetchAppointmentStart());
      await axios
        .get(
          `${BASE_URL}/admin/reports?query=${debounceQuery}`,
          authToken
        )
        .then((res: any) => {
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
    setStatus("");
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
    }, 700);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    setQuery("");
    setStatus("");
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
          `${BASE_URL}/admin/reports?query=${debounceQuery}`,
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
          `${BASE_URL}/admin/reports?status=${status}`,
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


  //pdf exporting/ saving
  const generatePdf = useReactToPrint({
    content:() => componentPdf.current,
    documentTitle:'PaymentData',
    onAfterPrint:() => toast.success("Data saved in pdf")
  }) 

  

  return (
    <section className="max-w-[90vw] md:max-w-full w-[1200px] px-5 mx-auto">
      <h1 className="text-xl mb-2">Reports</h1>

      <section
        style={{ backgroundColor: "rgb(243 244 246) " }}
        className=" py-4 mt-[10px]"
      >
        
        <div className="container mx-auto text-center flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div>
        <button className="btn bg-transparent hover:bg-black" onClick={generatePdf}><FaFilePdf size={30} color="red" /></button>
      </div>
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
              <input type="radio" name="filter" onClick={() => setStatus('Paid')}  />
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                Paid
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
      <div className="p-5 h-screen bg-gray-100">
        <div className="overflow-auto rounded-lg shadow hidden md:block">
          <div ref={componentPdf} style={{width:'100%'}}>
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                  #
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Name
                </th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Email
                </th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Doctor Charge
                </th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Extra Charge
                </th>
                <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                  Total Charge
                </th>
                <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                  CreatedAt
                </th>
                <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <Loader />
              ) : (
                currentReports.map((report, index) => (
                  <tr className="bg-gray-50" key={index}>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="p-3 text-sm text-gray-700 flex items-center gap-2">
                      <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-green-300 flex items-center justify-center">
                        <img
                          src={report.photo}
                          alt=""
                          className="w-full rounded-full"
                        />
                      </figure>
                      <span>{report.name}</span>
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {report.email}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {report.ticketPrice}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {report?.extraCharges}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {report?.totalCharges}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {report.status === 'cancelled' ? (
                        <span className="p-1.5 text-xs font-medium uppercase tracking-wide text-yellow-700 bg-yellow-200 rounded-lg bg-opacity-50">
                          Cancelled
                        </span>
                      ) : (
                        <span className="p-1.5 text-xs font-medium uppercase tracking-wide text-green-700 bg-green-200 rounded-lg bg-opacity-50">
                          Paid
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap"></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
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
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {loading ? (
            <Error errorMessage={error} />
          ) : (
            currentReports.map((report, index) => (
              <div className="bg-white p-4 rounded-lg shadow" key={index}>
                <div className="text-sm font-bold text-blue leading-7">
                  {index + 1}
                </div>
                <div className="text-gray-500 leading-7">
                  {report.createdAt}
                </div>
                <div className="text-sm font-medium text-black leading-7">
                  {report.email}
                </div>
                <div className="text-sm font-medium text-black leading-7">
                  {report.ticketPrice}
                </div>
                <div className="text-sm font-medium text-black leading-7">
                  {report?.extraCharges}
                </div>
                <div className="text-sm font-medium text-black leading-7">
                  {report?.totalCharges}
                </div>
                {report.status === 'cancelled' ? (
                  <div className="p-1.5 text-xs font-medium uppercase tracking-wide text-red-700 bg-red-200 rounded-lg bg-opacity-50 leading-7">
                    Cancelled
                  </div>
                ) : (
                  <div className="p-1.5 text-xs font-medium uppercase tracking-wide text-green-700 bg-green-200 rounded-lg bg-opacity-50 leading-7">
                    Paid
                  </div>
                )}
              </div>
            ))
          )}
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
      </div>
    </section>
  );
};

export default Reports;
