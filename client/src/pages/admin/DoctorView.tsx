import React, { useEffect, useState } from "react";
import { MdHealthAndSafety } from "react-icons/md";
import { FaUserDoctor, FaHospitalUser } from "react-icons/fa6";
import { BsMenuButtonWideFill } from "react-icons/bs";
import avatar from "../../assets/images/profile1.png";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../config";
import { Failure, Start, Success } from "../../slices/doctorSlice";

const DoctorView = () => {
  const { loading, singleDoctor, error } = useAppSelector(
    (data) => data.singleDoctor
  );

  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const dispatch = useAppDispatch();

  const { token } = useAppSelector((data) => data.admin);

  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    async function fetchDoctor() {
      dispatch(Start());

      await axios
        .get(
          `${BASE_URL}/doctors/getSingleDoctor/${singleDoctor?._id}`,
          authToken
        )
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

  const handleApprove = async(status:string) => {
    if(status === 'approve'){
      setIsApproved(true);
      setIsRejected(false);
    }else{
      setIsApproved(false);
      setIsRejected(true);
    }

    await axios.patch(`${BASE_URL}/admin/doctor-statusChange`,{status,doctorId:singleDoctor?._id},authToken)
    .then((res) => {
      toast.success(res.data.message);
    })
    .catch((err) => {
      toast.error(err.response.message);
    })
  };



  return (
    <section>
      <div className="max-w-[90vw] md:max-w-full w-[1200px] px-5 mx-auto">
        <div className="flex justify-between items-start h-min">
          <div className="glass" style={{ width: "30%", paddingTop: "3em" }}>
            <div className="title flex flex-col items-center">
              <h4 className="text-5xl font-bold">Doctor</h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                Doctor details.
              </span>
            </div>

            <div className="profile flex justify-center py-4">
              <img
                src={singleDoctor?.photo}
                className="profile_img"
                alt="avatar"
              />
            </div>

            <ul className="sidebar-list">
              <li className="sidebar-list-item text-center">
                <Link to="/admin/home">
                  <MdHealthAndSafety
                    color="rgb(102 181 163)"
                    className="icon"
                  />
                  <span>Details</span>
                </Link>
              </li>
              <li className="sidebar-list-item text-center">
                <Link to="/admin/doctors">
                  <FaUserDoctor color="rgb(102 181 163)" className="icon" />
                  Appointments
                </Link>
              </li>
            </ul>
          </div>

          <div
            className="glass"
            style={{ overflowY: "auto", maxHeight: "80vh" }}
          >
            <div className="mb-5 ">
              <div className="grid grid-col-3 gap-5 mb-[30px]">
                <div>
                  <p className="form__label">Specialization*</p>
                  <input
                    type="text"
                    readOnly
                    name="specialization"
                    value={singleDoctor?.specialization}
                    className="w-[50%] px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none
                    focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor
                    cursor-pointer rounded-md;"
                  />
                </div>
                <div>
                  <p className="form__label">Ticket Price*</p>
                  <input
                    type="number"
                    readOnly
                    name="ticketPrice"
                    value={singleDoctor?.ticketPrice}
                    className="w-[50%] px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none
                    focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor
                    cursor-pointer rounded-md;"
                  />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <p className="form__label">Qualification</p>
              {singleDoctor?.qualification?.map((item: any, index) => (
                <div key={index}>
                  <div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <p className="form__label">Starting Date*</p>
                        <input
                          readOnly
                          type="date"
                          name="startingDate"
                          value={item.startingDate}
                          className="form__input"
                        />
                      </div>
                      <div>
                        <p className="form__label">Ending Date*</p>
                        <input
                          readOnly
                          type="date"
                          name="endingDate"
                          value={item.endingDate}
                          className="form__input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 mt-5">
                      <div>
                        <p className="form__label">Degree*</p>
                        <input
                          readOnly
                          type="text"
                          name="degree"
                          value={item.degree}
                          className="form__input"
                        />
                      </div>
                      <div>
                        <p className="form__label">University*</p>
                        <input
                          readOnly
                          type="text"
                          name="university"
                          value={item.university}
                          className="form__input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <p className="form__label">Experience</p>
              {singleDoctor?.experience?.map((item: any, index) => (
                <div key={index}>
                  <div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <p className="form__label">Starting Date*</p>
                        <input
                          readOnly
                          type="date"
                          name="startingDate"
                          value={item.startingDate}
                          className="form__input"
                        />
                      </div>
                      <div>
                        <p className="form__label">Ending Date*</p>
                        <input
                          readOnly
                          type="date"
                          name="endingDate"
                          value={item.endingDate}
                          className="form__input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 mt-5">
                      <div>
                        <p className="form__label">Position*</p>
                        <input
                          readOnly
                          type="text"
                          name="position"
                          value={item.position}
                          className="form__input"
                        />
                      </div>
                      <div>
                        <p className="form__label">Hospital*</p>
                        <input
                          readOnly
                          type="text"
                          name="hospital"
                          value={item.hospital}
                          className="form__input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <p className="form__label">Time Slots</p>
              {singleDoctor?.timeSlots?.map((item: any, index) => (
                <div key={index}>
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5">
                      <div>
                        <p className="form__label">Day*</p>
                        <input
                          type="text"
                          readOnly
                          name="day"
                          value={item.day}
                          className="form__input py-3.5"
                        />
                      </div>

                      <div>
                        <p className="form__label">Starting Time*</p>
                        <input
                          readOnly
                          type="time"
                          name="startingTime"
                          value={item.startingTime}
                          className="form__input"
                        />
                      </div>
                      <div>
                        <p className="form__label">Ending Time*</p>
                        <input
                          readOnly
                          type="time"
                          name="endingTime"
                          value={item.endingTime}
                          className="form__input"
                        />
                      </div>
                      <div className="flex items-center"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-5">
              {!isApproved && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  onClick={()=>handleApprove('approve')}
                >
                  Approve
                </button>
              )}
              {!isRejected && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={()=>handleApprove('reject')}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorView;
