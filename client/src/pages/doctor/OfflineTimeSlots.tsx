import React, { useState } from 'react'
import { Doctor } from "./Profile";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Start, updateSuccess, Failure } from "../../slices/doctor/doctorSlice";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import { AiOutlineDelete } from "react-icons/ai";


type ErrorType = {
  timeSlots: {
    day:string;
    startingTime: string;
    endingTime: string;
    patientPerDay:any
  }[];
};

const OfflineTimeSlots = () => {

  const { currentDoctor, token } = useAppSelector((data) => data.doctor);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Doctor>({
    name: currentDoctor?.name,
    email: currentDoctor?.email,
    // password:"",
    phone: currentDoctor?.phone,
    bio: currentDoctor?.bio,
    gender: currentDoctor?.gender,
    specialization: currentDoctor?.specialization,
    ticketPrice: currentDoctor?.ticketPrice || 0,
    qualification: currentDoctor?.qualification?.map((qual: any) => ({
      startingDate: qual.startingDate,
      endingDate: qual.endingDate,
      degree: qual.degree,
      university: qual.university,
    })) || [{ startingDate: "", endingDate: "", degree: "", university: "" }],
    experience: currentDoctor?.experience?.map((exp: any) => ({
      startingDate: exp.startingDate,
      endingDate: exp.endingDate,
      position: exp.position,
      hospital: exp.hospital,
    })) || [{ startingDate: "", endingDate: "", position: "", hospital: "" }],
    timeSlots: currentDoctor?.timeSlots?.map((time: any) => ({
      day: time.day,
      startingTime: time.startingTime,
      endingTime: time.endingTime,
      patientPerDay: time.patientPerDay,
    })) || [{ day: "", startingTime: "", endingTime: "", patientPerDay: "" }],
    onlineTimeSlots: currentDoctor?.onlineTimeSlots?.map((time: any) => ({
      day: time.day,
      startingTime: time.startingTime,
      endingTime: time.endingTime,
      patientPerDay: time.patientPerDay,
    })) || [{ day: "", startingTime: "", endingTime: "", patientPerDay: "" }],
    photo: currentDoctor?.photo,
  });

  const [errors, setErrors] = useState<ErrorType>({
    timeSlots: [
      { day:"",startingTime: "", endingTime: "", patientPerDay: ""},
    ],
  });

    const validateForm = () => {
    let valid = true;
    const newErrors: ErrorType = { ...errors };
  
    if (formData?.timeSlots) {
      newErrors.timeSlots = formData.timeSlots.map((slot) => {
        const error: any = {};
        if (!slot.day) {
          error.day = 'Day is required';
          valid = false;
        }
        if (!slot.startingTime) {
          error.startingTime = 'Starting time is required';
          valid = false;
        }
        if (!slot.endingTime) {
          error.endingTime = 'Ending time is required';
          valid = false;
        }
  
        if(!slot.patientPerDay){
          error.patientPerDay = 'patient per day is required';
          valid = false;
        }
  
        return error;
      });
    }
  
    setErrors(newErrors);
    return valid;
  }

  const updateProfileHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't proceed if form validation fails
    }

    dispatch(Start());

    try {
      const res = await fetch(`${BASE_URL}/doctors/${currentDoctor?._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      const { data, message } = result;
      if (!res.ok) {
        dispatch(Failure(message));
        throw Error(message);
      }
      console.log(data);
      dispatch(updateSuccess({ data }));
      toast.success(message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const addItem = (key: keyof Doctor, item: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...(prevFormData[key] as any[]), item],
    }));
  };

  //reusable input change function

  const handleReusableInputChangeFnc = (
    key: keyof Doctor,
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      const updateItems = [...(prevFormData[key] as any[])];

      updateItems[index][name] = value;

      return {
        ...prevFormData,
        [key]: updateItems,
      };
    });
  };

  //reusable function for deleting item
  const deleteItem = (key: keyof Doctor, index: number) => {
    setFormData((prevFormData) => {
      if (!prevFormData || !(key in prevFormData)) {
        return prevFormData; // or handle null/undefined case as needed
      }

      const dataArray = prevFormData[key];
      if (!Array.isArray(dataArray)) {
        return prevFormData; // or handle non-array case as needed
      }

      const updatedArray = dataArray.filter((_, i) => i !== index);

      return {
        ...prevFormData,
        [key]: updatedArray,
      };
    });
  };

  const addTimeSlots = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    addItem("timeSlots", {
      day: "",
      startingTime: "",
      endingTime: "",
      patientPerDay:""
    });
  };

  const handleTimeSlotsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    handleReusableInputChangeFnc("timeSlots", index, event);
  };

  const deleteTimeSlots = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    deleteItem("timeSlots", index);
  };


  return (
    <div>
    <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
      Offline Time Slots
    </h2>
    <form action="" onSubmit={updateProfileHandler}>

    <div className="mb-5">
          <p className="form__label">Time Slots</p>
          {formData.timeSlots?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5">
                  <div>
                    <p className="form__label">Day*</p>
                    <select
                     name="day"
                      value={item.day}
                      className="form__input py-3.5"
                      onChange={(e) => handleTimeSlotsChange(e, index)}
                    >
                      <option value="">Select</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                    </select>
                    {errors?.timeSlots?.[index]?.day && (
                      <p className="text-red-300">
                        {errors?.timeSlots?.[index]?.day}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="form__label">Starting Time*</p>
                    <input
                      type="time"
                     // {...register(`timeSlots.${index}.startingTime`)}
                      name="startingTime"
                      value={item.startingTime}
                      className="form__input"
                      onChange={(e) => handleTimeSlotsChange(e, index)}
                    />
                    {errors?.timeSlots?.[index]?.startingTime && (
                      <p className="text-red-300">
                        {errors?.timeSlots?.[index]?.startingTime}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="form__label">Ending Time*</p>
                    <input
                      type="time"
                     // {...register(`timeSlots.${index}.endingTime`)}
                      name="endingTime"
                      value={item.endingTime}
                      className="form__input"
                      onChange={(e) => handleTimeSlotsChange(e, index)}
                    />
                    {errors?.timeSlots?.[index]?.endingTime && (
                      <p className="text-red-300">
                        {errors?.timeSlots?.[index]?.endingTime}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="form__label">Patient per day</p>
                    <input
                      type="number"
                      min={1}
                     // {...register(`timeSlots.${index}.endingTime`)}
                      name="patientPerDay"
                      value={item.patientPerDay}
                      className="form__input"
                      onChange={(e) => handleTimeSlotsChange(e, index)}
                    />
                    {errors?.timeSlots?.[index]?.patientPerDay && (
                      <p className="text-red-300">
                        {errors?.timeSlots?.[index]?.patientPerDay}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={(e) => deleteTimeSlots(e, index)}
                      className="bg-red-600 p-2 rounded-full text-white text-[18px]  mb-[30px]
                cursor-pointer mt-6"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addTimeSlots}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add TimeSlot
          </button>
        </div>
      
      <div className="mt-7">
        <button
          type="submit"
          className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
        >
          Update TimeSlots
        </button>
      </div>
    </form>
  </div>
  )
};

export default OfflineTimeSlots
