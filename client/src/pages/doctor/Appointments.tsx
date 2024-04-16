import { useEffect, useState } from "react";
import convertTime from "../../utilis/convertTime";
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

const Appointments = () => {
  const { token } = useAppSelector((data) => data.doctor);

  const [query, setQuery] = useState<string | "">("");
  const [query1, setQuery1] = useState<string | "">("");
  const [debounceQuery, setDebounceQuery] = useState<string | "">("");
  const handleSearch = () => {
    setQuery(query.trim());
  };
  const { appointments, loading, error } = useAppSelector(
    (state) => state.appointment
  );
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    async function fetchAppointments() {
      dispatch(fetchAppointmentStart());
      await axios
        .get(
          `${BASE_URL}/doctors/getAppointments?query=${debounceQuery}`,
          authToken
        )
        .then((res) => {
          dispatch(fetchAppointmentSuccess(res.data.data));
        })
        .catch((err) => {
          dispatch(fetchAppointmentFailed(err.response.data.message));
          toast.error(err);
        });
    }
    fetchAppointments();
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
                </div>
              </th>
              <td className="px-6 py-4">{item.gender}</td>
              <td className="px-6 py-4">
                {item.isPaid && (
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
            </tr>
          ))}
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
  );
};

export default Appointments;
