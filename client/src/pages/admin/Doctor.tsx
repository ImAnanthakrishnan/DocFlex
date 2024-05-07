import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
//import Modal from "react-modal";
import {
  fetchDoctorStart,
  fetchDoctorListSuccess,
  fetchDoctorListFailed,
} from "../../slices/admin/doctorListSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { toast } from "react-toastify";
import Error from "../../components/Error";
import { BsThreeDots } from "react-icons/bs";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { Failure, Start, Success } from "../../slices/doctorSlice";
import { AiTwotoneLeftCircle, AiTwotoneRightCircle } from "react-icons/ai";

const Doctors = () => {
  const [query, setQuery] = useState<string | "">("");
  const [query1, setQuery1] = useState<string | "">("");
  const [debounceQuery, setDebounceQuery] = useState<string | "">("");
  const handleSearch = () => {
    setQuery(query.trim());
  };

  const { token } = useAppSelector((data) => data.admin);

  const { doctorList, loading, error } = useAppSelector(
    (data) => data.doctorList
  );

  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage: number = 5;

  // Calculate index of first and last item for current page
  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;

  // Slice the doctors array to display only items for current page
  const currentDoctors = doctorList.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  //total pages
  const totalPages = Math.ceil(doctorList.length / itemsPerPage);

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

  const [reloadData, setReloadData] = useState<boolean>(false);

  let navigate = useNavigate();

  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      dispatch(fetchDoctorStart());
      await axios
        .get(
          `${BASE_URL}/doctors/getAllDoctors?query=${debounceQuery}`,
          authToken
        )
        .then((res: any) => {
          const { data, message } = res?.data;
          let result = data.map((item: any) => item._doc);

          dispatch(fetchDoctorListSuccess(data));
        })
        .catch((err) => {
          const { message } = err.response.data;

          dispatch(fetchDoctorListFailed(message));
          toast.error(message);
        });
    };
    fetchDoctor();
  }, [reloadData, debounceQuery == ""]);
  console.log("doc-" + doctorList);

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
    const fetchDoctor = async () => {
      dispatch(fetchDoctorStart());
      await axios
        .get(
          `${BASE_URL}/doctors/getAllDoctors?query=${debounceQuery}`,
          authToken
        )
        .then((res: any) => {
          const { data, message } = res?.data;
          let result = data.map((item: any) => item._doc);

          dispatch(fetchDoctorListSuccess(data));
        })
        .catch((err) => {
          const { message } = err.response.data;

          dispatch(fetchDoctorListFailed(message));
          toast.error(message);
        });
    };
    if (debounceQuery !== "") {
      fetchDoctor();
    }
  }, [debounceQuery]);

  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>(
    null
  );

  const toggleDropdown = (doctorId: string | number) => {
    setOpenDropdownId((prevId) => (prevId === doctorId ? null : doctorId));
  };

  const closeDropdown = () => setOpenDropdownId(null);

  const statusChange = async (status: string, doctorId: number | string) => {
    closeDropdown();

    await axios
      .patch(
        `${BASE_URL}/admin/doctor-statusChange`,
        { status, doctorId },
        authToken
      )
      .then((res: any) => {
        const { message } = res?.data;
        toast.success(message);
        setReloadData((prev) => !prev);
      })
      .catch((err) => {
        const { message } = err.response.data;

        toast.error(message);
      });
  };

  const [blockStatus, setBlockStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const storedBlockStatus = localStorage.getItem("doctorBlockStatus");
    if (storedBlockStatus) {
      setBlockStatus(JSON.parse(storedBlockStatus));
    }
  }, []);

  const handleBlock = async (doctorId: number | string) => {
    const updatedBlockStatus = {
      ...blockStatus,
      [doctorId]: !blockStatus[doctorId],
    };
    setBlockStatus(updatedBlockStatus);
    localStorage.setItem(
      "doctorBlockStatus",
      JSON.stringify(updatedBlockStatus)
    );
    closeDropdown();

    const status = updatedBlockStatus[doctorId] ? "block" : "unblock";

    await axios
      .patch(
        `${BASE_URL}/admin/${status}/${doctorId}`,
        {
          doctor: true,
        },
        authToken
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const viewDoctor = async (doctorId: number | string) => {
    dispatch(Start());

    await axios
      .get(`${BASE_URL}/doctors/getSingleDoctor/${doctorId}`, authToken)
      .then((res) => {
        console.log(res?.data);
        const { data } = res?.data;
        dispatch(Success(data));
        navigate("/admin/doctors/view");
      })
      .catch((err) => {
        const { message } = err.response.data;
        toast.error(message);
        dispatch(Failure(message));
      });
  };

  return (
    <section className="max-w-[90vw] md:max-w-full w-[1200px] px-5 mx-auto">
      <h1 className="text-xl mb-2">Doctors</h1>
      <section
        style={{ backgroundColor: "rgb(243 244 246) " }}
        className=" py-4 mt-[10px]"
      >
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
      </section>
      <div className="p-5 h-screen bg-gray-100">
        <div className="overflow-auto rounded-lg shadow hidden md:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                  #
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Doctor
                </th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  CreatedAt
                </th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Email
                </th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Status
                </th>
                <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                  Phone
                </th>
                <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <Loader />
              ) : (
                currentDoctors.map((doctor, index) => (
                  <tr className="bg-gray-50" key={index}>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="p-3 text-sm text-gray-700 flex items-center gap-2">
                      <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-green-300 flex items-center justify-center">
                        <img
                          src={doctor.photo}
                          alt=""
                          className="w-full rounded-full"
                        />
                      </figure>
                      <span>{doctor.name}</span>
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(doctor.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {doctor.email}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {doctor.isApproved === "pending" ? (
                        <span className="p-1.5 text-xs font-medium uppercase tracking-wide text-yellow-700 bg-yellow-200 rounded-lg bg-opacity-50">
                          Pending
                        </span>
                      ) : doctor.isApproved === "approved" ? (
                        <span className="p-1.5 text-xs font-medium uppercase tracking-wide text-green-700 bg-green-200 rounded-lg bg-opacity-50">
                          Approved
                        </span>
                      ) : (
                        <span className="p-1.5 text-xs font-medium uppercase tracking-wide text-red-700 bg-red-200 rounded-lg bg-opacity-50">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {doctor.phone}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <BsThreeDots size={25} onClick={() => toggleDropdown(doctor._id)} />
                    </td>
                  </tr>
                ))
              )}
              {doctorList.map(
                (doctor) =>
                  openDropdownId === doctor._id && (
                    <div
                      key={doctor._id}
                      className="absolute right-0 top-0 mt-2  bg-white border border-gray-200 rounded shadow-md"
                    >
                      {/* Dropdown items */}
                      <div className="py-1">
                        <button
                          onClick={() => handleBlock(doctor._id)}
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 bg-green-300 w-full`}
                        >
                          {blockStatus[doctor._id] ? (
                            <p>Unblock</p>
                          ) : (
                            <p>Block</p>
                          )}
                        </button>
                        <button
                          onClick={() => viewDoctor(doctor._id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 bg-red-300 w-full"
                        >
                          View
                        </button>
                        {/* Add more dropdown items as needed */}
                      </div>
                    </div>
                  )
              )}
            </tbody>
          </table>
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
            currentDoctors.map((doctor, index) => (
              <div className="bg-white p-4 rounded-lg shadow" key={index}>
                <div className="text-sm font-bold text-blue leading-7">
                  {index + 1}
                </div>
                <div className="text-gray-500 leading-7">
                  {doctor.createdAt}
                </div>
                <div className="text-sm font-medium text-black leading-7">
                  {doctor.email}
                </div>
                {doctor.isApproved === "pending" ? (
                  <div className="p-1.5 text-xs font-medium uppercase tracking-wide text-yellow-700 bg-yellow-200 rounded-lg bg-opacity-50 leading-7">
                    Pending
                  </div>
                ) : doctor.isApproved === "approved" ? (
                  <div className="p-1.5 text-xs font-medium uppercase tracking-wide text-green-700 bg-green-200 rounded-lg bg-opacity-50 leading-7">
                    Approved
                  </div>
                ) : (
                  <div className="p-1.5 text-xs font-medium uppercase tracking-wide text-red-700 bg-red-200 rounded-lg bg-opacity-50 leading-7">
                    Cancelled
                  </div>
                )}

                <div className="text-sm font-medium text-black leading-7">
                  {doctor.phone}
                </div>
                <div className="text-sm font-medium text-black leading-7">
                  <BsThreeDots />
                </div>
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

export default Doctors;
