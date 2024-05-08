import  { useState } from "react";
import { BASE_URL } from "../../../config";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../app/hooks";
import convertTime from "../../../utilis/convertTime";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type TimeSlotsType = {
  day?: string;
  startingTime?: string;
  endingTime?: string;
  patientPerDay?: number | undefined | string;
};

type PropsType = {
  doctorId: string | number | undefined;
  ticketPrice: number | undefined;
  timeSlots: TimeSlotsType[] | undefined;
  onlineSlots: TimeSlotsType[] | undefined;
  extraCharges:number|undefined
};

const SidePanel = ({
  doctorId,
  ticketPrice,
  timeSlots,
  onlineSlots,
  extraCharges
}: PropsType) => {
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<TimeSlotsType | null>(null);

  const [selectedMode, setSelectedMode] = useState<string | "">("");

  const [modalOpen, setModalOpen] = useState(false);

  const { token,currentUser } = useAppSelector((data) => data.user);

  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log(selectedTimeSlot);
  let navigate = useNavigate();
  const bookingHandler = async () => {
    if (selectedTimeSlot === null || selectedMode === "") {
      return toast.error("please select time and mode");
    }

    //popup modal
    setModalOpen(true);

    /* await axios.post(`${BASE_URL}/wallet/debit`,{cash:ticketPrice},authToken)
        .then((res)=>{
            toast.success(res.data.message);
            navigate(`/checkout-success/${res.data.data.totalCash}`);
        }).catch((err)=>{
            toast.error(err.response.data.message);
        })



        try{
            const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}`,{
                method:'post',
                headers:{
                    Authorization:`Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appointmentDate: selectedTimeSlot,
                    modeOfAppointment: selectedMode, 
                }),
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message + 'Please try again');
            }

            if(data.session.url){
                window.location.href = data.session.url
            }
        }
        catch(err:any){
            toast.error(err.message);
        }*/
  };

  function closeModal() {
    setModalOpen(false);
  }

  const walletHandler = async () => {
    setModalOpen(false);

    await axios
      .post(`${BASE_URL}/wallet/debit`, {userId:currentUser?._id, doctorId, cash: ticketPrice,
        appointmentDate: selectedTimeSlot ,
        modeOfAppointment: selectedMode,
       }, authToken)
      .then((res) => {
        toast.success(res.data.message);
        navigate(`/checkout-success?cash=${res.data.data.totalCash}`);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const stripeHandler = async () => {
    setModalOpen(false);

    try {
      const res = await fetch(
        `${BASE_URL}/bookings/checkout-session/${doctorId}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentDate: selectedTimeSlot || "offline",
            modeOfAppointment: selectedMode,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message + "Please try again");
      }

      if (data.session.url) {
        window.location.href = data.session.url;
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  console.log("selected-", selectedTimeSlot);
  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice} INR
        </span>
      </div>
      <div className="flex items-center justify-between">
      <p className="text__para mt-2 font-semibold font text-sm">Extra charge</p>
      <span className="text-[10px] leading-7 lg:text-[18px] lg:leading-8 text-headingColor font-bold ">
      ₹{extraCharges}
        </span>
      </div>
      <div className="mt-[30px]">
        <p className="text__para mt-5 font-semibold text-sm text-headingColor ">
          Mode Of Meeting:
        </p>
        <div className="flex justify-around mt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              className="input__form"
              name="appointmentMode"
              value="offline"
              onChange={() => setSelectedMode("offline")}
              defaultChecked
            />
            <span className="text-[15px] leading-6 text-textColor font-semibold">
              Offline
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              className="input__form"
              name="appointmentMode"
              value="online"
              onChange={() => setSelectedMode("online")}
            />
            <span className="text-[15px] leading-6 text-textColor font-semibold">
              Online
            </span>
          </label>
        </div>

        <p className="text__para mt-0 font-semibold text-headingColor">
          Available Time Slots:
        </p>
        {selectedMode === "online" ? (
          <ul className="mt-3">
            {onlineSlots?.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    className="input__form"
                    name="timeSlot"
                    onChange={() => setSelectedTimeSlot(item)}
                  />
                  <p className="text-[15px] leading-6 text-textColor font-semibold">
                    {item.day &&
                      item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                  </p>
                  <p className="text-[15px] leading-6  text-textColor font-semibold ">
                    {convertTime(item.startingTime)} -{" "}
                    {convertTime(item.endingTime)}
                  </p>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-3">
            {timeSlots?.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    className="input__form"
                    name="timeSlot"
                    onChange={() => setSelectedTimeSlot(item)}
                  />
                  <p className="text-[15px] leading-6 text-textColor font-semibold">
                    {item.day &&
                      item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                  </p>
                  <p className="text-[15px] leading-6  text-textColor font-semibold ">
                    {convertTime(item.startingTime)} -{" "}
                    {convertTime(item.endingTime)}
                  </p>
                </label>
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="btn px-2 w-full rounded-md mt-3"
          onClick={bookingHandler}
        >
          Book Appointment
        </button>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Method of payment</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="modal-content flex justify-evenly">
              <button
                className="btn rounded-sm bg-lime-300"
                onClick={walletHandler}
              >
                Wallet
              </button>
              <button
                className="btn rounded-sm bg-irisBlueColor"
                onClick={stripeHandler}
              >
                Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
