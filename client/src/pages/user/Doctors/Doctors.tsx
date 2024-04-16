import DoctorCard from "../../../components/doctor/DoctorCard";
import { doctors } from "../../../assets/doctors";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { BASE_URL } from "../../../config";
import {
  fetchDoctorStart,
  fetchDoctorListSuccess,
  fetchDoctorListFailed,
} from "../../../slices/user/doctorListSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import Error from "../../../components/Error";
import { AiTwotoneLeftCircle, AiTwotoneRightCircle } from "react-icons/ai";

const Doctors = () => {
  const { token } = useAppSelector((data) => data.user);

  const { approvedDoctorList, loading, error } = useAppSelector(
    (data) => data.approvedDoctorList
  );

  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage: number = 5;

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

  const [query, setQuery] = useState<string | "">("");
  const [debounceQuery, setDebounceQuery] = useState<string | "">("");
  const handleSearch = () => {
    setQuery(query.trim());
  };

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
          `${BASE_URL}/doctors/getAllApprovedDoctors?query=${debounceQuery}`,
          authToken
        )
        .then((res: any) => {
          const { data, message } = res?.data;
          console.log(res.data);
          //let result = data.map((item: any) => item._doc);
          console.log("dat-", data);
          dispatch(fetchDoctorListSuccess(data));
        })
        .catch((err) => {
          const { message } = err.response.data;

          dispatch(fetchDoctorListFailed(message));
          toast.error(message);
        });
    };
    fetchDoctor();
  }, [debounceQuery == ""]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
    }, 700);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const fetchDoctorsWithSearch = async () => {
      dispatch(fetchDoctorStart());
      try {
        const res = await axios.get(
          `${BASE_URL}/doctors/getAllApprovedDoctors?query=${debounceQuery}`,
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

  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading">Find a Doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline cursor-pointer
          placeholder:text-textColor"
              placeholder="Search doctor by name or specification"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn mt-0 rounded-r-md" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {loading && <Loader />}
          {error && <Error errorMessage={error} />}
          {!loading && !error && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:grid-cols-4
    "
            >
              {currentDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} booking={false} />
              ))}
            </div>
          )}
        </div>
        {/* Pagination buttons */}
        <div className="flex justify-center mt-10">
          <button
            className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
            onClick={handlePrevPage}
          >
            <AiTwotoneLeftCircle size={25} />
          </button>
         <p className="text-2xl">{currentPage} / {totalPages}</p> 
          <button
            className="bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300"
            onClick={handleNextPage}
          >
            <AiTwotoneRightCircle size={25} />
          </button>
        </div>
      </section>
    </>
  );
};

export default Doctors;
