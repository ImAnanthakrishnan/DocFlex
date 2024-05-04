import React, { useState } from "react";
import { Doctor } from "./Profile";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Start, updateSuccess, Failure } from "../../slices/doctor/doctorSlice";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import { AiOutlineDelete } from "react-icons/ai";

type ErrorType = {
  qualification: {
    startingDate: string;
    endingDate: string;
    degree: string;
    university: string;
  }[];
};

const Education = () => {
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
    qualification: [
      { startingDate: "", endingDate: "", degree: "", university: "" },
    ],
  });

  const validateForm = () => {
    let valid = true;
    const newErrors: ErrorType = { ...errors };
  
    if (formData?.qualification) {
      newErrors.qualification = formData.qualification.map((qual) => {
        const error: any = {};
        if (!qual.startingDate) {
          error.startingDate = 'Starting date is required';
          valid = false;
        }
        if (!qual.endingDate) {
          error.endingDate = 'Ending date is required';
          valid = false;
        }
        if (!qual.degree) {
          error.degree = 'Degree is required';
          valid = false;
        }
        if (!qual.university) {
          error.university = 'University is required';
          valid = false;
        }
        return error;
      });
    }
  
    setErrors(newErrors);
    return valid;
  };

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

  const addQualification = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    addItem("qualification", {
      startingDate: "",
      endingDate: "",
      degree: "",
      university: "",
    });
  };

  const handleQualificationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    handleReusableInputChangeFnc("qualification", index, event);
  };

  const deleteQualification = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    deleteItem("qualification", index);
  };

  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Education
      </h2>
      <form action="" onSubmit={updateProfileHandler}>
        <div className="mb-5">
          <p className="form__label">Qualification</p>
          {formData.qualification?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">Starting Date*</p>
                    <input
                      type="date"
                      //{...register(`qualification.${index}.startingDate`)}
                      name="startingDate"
                      value={item.startingDate}
                      className="form__input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                    {errors?.qualification?.[index]?.startingDate && (
                      <p className="text-red-300">
                        {errors?.qualification?.[index]?.startingDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="form__label">Ending Date*</p>
                    <input
                      type="date"
                      // {...register(`qualification.${index}.endingDate`)}
                      name="endingDate"
                      value={item.endingDate}
                      className="form__input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                    {errors?.qualification?.[index]?.endingDate && (
                      <p className="text-red-300">
                        {errors?.qualification?.[index]?.endingDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div>
                    <p className="form__label">Degree*</p>
                    <input
                      type="text"
                      //{...register(`qualification.${index}.degree`)}
                      name="degree"
                      value={item.degree}
                      className="form__input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                    {errors?.qualification?.[index]?.degree && (
                      <p className="text-red-300">
                        {errors?.qualification?.[index]?.degree}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="form__label">University*</p>
                    <input
                      type="text"
                      // {...register(`qualification.${index}.university`)}
                      name="university"
                      value={item.university}
                      className="form__input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                    {errors?.qualification?.[index]?.startingDate && (
                      <p className="text-red-300">
                        {errors?.qualification?.[index]?.university}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px]
              cursor-pointer"
                  onClick={(e) => deleteQualification(e, index)}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addQualification}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Qualification
          </button>
        </div>

        <div className="mt-7">
          <button
            type="submit"
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
          >
            Update Qualification
          </button>
        </div>
      </form>
    </div>
  );
};

export default Education;
