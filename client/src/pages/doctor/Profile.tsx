import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageCloudinary from "../../utilis/uploadCloudinary";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Start, updateSuccess, Failure } from "../../slices/doctor/doctorSlice";

import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Doctor = {
  name?: string;
  email?: string;
  //password:any;
  phone?: string | number;
  bio?: string;
  gender?: string;
  specialization?: string;
  ticketPrice?: number | string;
  qualification?: {
    startingDate: string;
    endingDate: string;
    degree: string;
    university: string;
  }[];
  experience: {
    startingDate: string;
    endingDate: string;
    position: string;
    hospital: string;
  }[];
  timeSlots: {
    day: string;
    startingTime: string;
    endingTime: string;
  }[];
  photo?: string;
};

const Profile = () => {
  const { currentDoctor, token } = useAppSelector((data) => data.doctor);
  const [formData, setFormData] = useState<Doctor>({
    name: currentDoctor?.name,
    email: currentDoctor?.email,
    // password:"",
    phone: currentDoctor?.phone,
    bio: currentDoctor?.bio,
    gender: currentDoctor?.gender,
    specialization: currentDoctor?.specialization,
    ticketPrice: currentDoctor?.ticketPrice || 0,
    qualification: currentDoctor?.qualification?.map((qual:any) => ({
      startingDate: qual.startingDate,
      endingDate: qual.endingDate,
      degree: qual.degree,
      university: qual.university,
    })) || [{ startingDate: "", endingDate: "", degree: "", university: "" }],
    experience: currentDoctor?.experience?.map((exp:any) => ({
      startingDate: exp.startingDate,
      endingDate: exp.endingDate,
      position: exp.position,
      hospital: exp.hospital,
    })) || [{ startingDate: "", endingDate: "", position: "", hospital: "" }],
    timeSlots: currentDoctor?.timeSlots?.map((time:any) => ({
      day: time.day,
      startingTime: time.startingTime,
      endingTime: time.endingTime,
    })) || [{day: "", startingTime: "", endingTime: "" }],
    photo: currentDoctor?.photo,
  });

  const dispatch = useAppDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await uploadImageCloudinary(file);

      setFormData({
        ...formData,
        photo: data?.url,
      });
    }
  };

  /*const doctorSchema: ZodType<Doctor> = z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .optional(),
    email: z.string().email({ message: "Invalid email format" }).optional(),
    phone: z
      .string()
      .length(10, { message: "Phone number must be exactly 10 digits" })
      .regex(/^\d+$/, { message: "Phone must contain only numbers" }),
    bio: z.string().min(2),
    gender: z
      .string()
      .refine((value) => value === "male" || value === "female", {
        message: "Gender is required",
      })
      .optional(),
    specialization: z.string().min(2, { message: "This is required" }),
    ticketPrice: z.string().refine(
      (value) => {
        const numberValue = parseFloat(value);
        return !isNaN(numberValue) && numberValue >= 0;
      },
      { message: "Enter a validTicketPrice " }
    ),
   /* qualification: z.array(
      z.object({
        startingDate: z.string().min(2, { message: "This is required" }),
        endingDate: z.string().min(2, { message: "This is required" }),
        degree: z.string().min(2, { message: "This is required" }),
        university: z.string().min(2, { message: "This is required" }),
      })
    ),*/
   /* experience: z.array(
      z.object({
        startingDate: z.string().min(2, { message: "This is required" }),
        endingDate: z.string().min(2, { message: "This is required" }),
        position: z.string().min(2, { message: "This is required" }),
        hospital: z.string().min(2, { message: "This is required" }),
      })
    ),*/
    /*timeSlots: z.array(
      z.object({
        day: z.string().min(2, { message: "This is required" }),
        startingTime: z.string().min(2, { message: "This is required" }),
        endingTime: z.string().min(2, { message: "This is required" }),
      })
    ),*/
    // photo: z.string().min(2, { message: "Please select an image" }).optional(),
  //});

 /* const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Doctor>({ resolver: zodResolver(doctorSchema) });*/

  const [errors, setErrors] = useState<Doctor >({
    name: '',
    email: '',
    // password:"",
    phone: '',
    bio: '',
    gender: '',
    specialization: '',
    ticketPrice: '',
    qualification: [
       { startingDate: "", endingDate: "", degree: "", university: "" },
    ],
    experience: [
       { startingDate: "", endingDate: "", position: "", hospital: "" },
    ],
    timeSlots: [
      { day: "", startingTime: "", endingTime: "" }
    ],
    photo: '',
  });


  const validateForm = () => {
    let valid = true;
    const newErrors:Doctor = {...errors};

    if (!formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    } else {
      newErrors.name = '';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    } else {
      newErrors.email = '';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(String(formData.phone))) {
      newErrors.phone = 'Phone number must be 10 digits';
      valid = false;
    } else {
      newErrors.phone = '';
    }

    if (!formData.bio) {
      newErrors.bio = 'Bio is required';
      valid = false;
    } else {
      newErrors.bio = '';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      valid = false;
    } else {
      newErrors.gender = '';
    }

    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
      valid = false;
    } else {
      newErrors.specialization = '';
    }

    if (!formData.ticketPrice) {
      newErrors.ticketPrice = 'Ticket price is required';
      valid = false;
    } else if (isNaN(parseFloat(String(formData.ticketPrice)))) {
      newErrors.ticketPrice = 'Ticket price must be a number';
      valid = false;
    } else if (parseFloat(String(formData.ticketPrice)) < 0) {
      newErrors.ticketPrice = 'Ticket price must be non-negative';
      valid = false;
    } else {
      newErrors.ticketPrice = '';
    }

    newErrors.qualification = formData?.qualification?.map((qual) => {
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

    newErrors.experience = formData.experience.map((exp) => {
      const error: any = {};
      if (!exp.startingDate) {
        error.startingDate = 'Starting date is required';
        valid = false;
      }
      if (!exp.endingDate) {
        error.endingDate = 'Ending date is required';
        valid = false;
      }
      if (!exp.position) {
        error.position = 'Position is required';
        valid = false;
      }
      if (!exp.hospital) {
        error.hospital = 'Hospital is required';
        valid = false;
      }
      return error;
    });

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
      return error;
    });

    if (!formData.photo) {
      newErrors.photo = 'Photo is required';
      valid = false;
    } else {
      newErrors.photo = '';
    }

    setErrors(newErrors);
     return valid;

  }

  const updateProfileHandler = async (e:React.FormEvent<HTMLFormElement>) => {
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
    /* setFormData(prevFormData => ({
      ...prevFormData,
      [key]:prevFormData[key]?.filter((_:undefined,i:number) => i!==index)
     
    }))*/
    // console.log(formData)
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

  const addExperience = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    addItem("experience", {
      startingDate: "",
      endingDate: "",
      position: "",
      hospital: "",
    });
  };

  const handleExperienceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    handleReusableInputChangeFnc("experience", index, event);
  };

  const deleteExperience = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    deleteItem("experience", index);
  };

  const addTimeSlots = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    addItem("timeSlots", {
      day: "",
      startingTime: "",
      endingTime: "",
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
        Profile Information
      </h2>
      <form action="" onSubmit={updateProfileHandler}>
        <div className="mb-5">
          <p className="from__label">Name*</p>
          <input
            type="text"
          //  {...register("name")}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="form__input"
          />
          {errors.name && <p className="text-red-300">{errors.name}</p>}
        </div>
        <div className="mb-5">
          <p className="from__label">Email*</p>
          <input
            type="email"
           // {...register("email")}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="form__input"
            readOnly
            aria-readonly
            disabled={true}
          />
          {errors.email && (
            <p className="text-red-300">{errors.email}</p>
          )}
        </div>
        <div className="mb-5">
          <p className="from__label">Phone*</p>
          <input
            type="text"
           // {...register("phone")}
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone number"
            className="form__input"
          />
          {errors.phone && (
            <p className="text-red-300">{errors.phone}</p>
          )}
        </div>
        <div className="mb-5">
          <p className="from__label">Bio*</p>
          <input
            type="text"
           // {...register("bio")}
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            className="form__input"
            maxLength={100}
          />
          {errors.bio && <p className="text-red-300">{errors.bio}</p>}
        </div>
        <div className="mb-5 ">
          <div className="grid grid-col-3 gap-5 mb-[30px]">
            <div>
              <p className="from__label">Gender*</p>
              <select
                //{...register("gender")}
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form__input py-3.5"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-300">{errors.gender}</p>
              )}
            </div>
            <div>
              <p className="from__label">Specialization*</p>
              <input
                type="text"
               // {...register("specialization")}
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="specialization"
                className="form__input"
              />
              {errors.specialization && (
                <p className="text-red-300">{errors.specialization}</p>
              )}
            </div>
            <div>
              <p className="from__label">Ticket Price*</p>
              <input
                type="number"
               // {...register("ticketPrice")}
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                //  placeholder="100"
                className="form__input"
              />
              {errors.ticketPrice && (
                <p className="text-red-300">{errors.ticketPrice}</p>
              )}
            </div>
          </div>
        </div>

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

        <div className="mb-5">
          <p className="form__label">Experience</p>
          {formData.experience?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">Starting Date*</p>
                    <input
                      type="date"
                     // {...register(`experience.${index}.startingDate`)}
                      name="startingDate"
                      value={item.startingDate}
                      className="form__input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                    {errors?.experience?.[index]?.startingDate && (
                      <p className="text-red-300">
                        {errors?.experience?.[index]?.startingDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="form__label">Ending Date*</p>
                    <input
                      type="date"
                     // {...register(`experience.${index}.endingDate`)}
                      name="endingDate"
                      value={item.endingDate}
                      className="form__input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                    {errors?.experience?.[index]?.endingDate && (
                      <p className="text-red-300">
                        {errors?.experience?.[index]?.endingDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div>
                    <p className="form__label">Position*</p>
                    <input
                      type="text"
                     // {...register(`experience.${index}.position`)}
                      name="position"
                      value={item.position}
                      className="form__input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                    {errors?.experience?.[index]?.position && (
                      <p className="text-red-300">
                        {errors?.experience?.[index]?.position}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="form__label">Hospital*</p>
                    <input
                      type="text"
                      //{...register(`experience.${index}.hospital`)}
                      name="hospital"
                      value={item.hospital}
                      className="form__input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                    {errors?.experience?.[index]?.hospital && (
                      <p className="text-red-300">
                        {errors?.experience?.[index]?.hospital}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px]
                cursor-pointer"
                  onClick={(e) => deleteExperience(e, index)}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addExperience}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Experience
          </button>
        </div>

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

        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img
                src={formData.photo}
                alt=""
                className="w-full rounded-full"
              />
            </figure>
          )}

          <div className="relative w-[160px] h-[50px]">
            <input
              type="file"
              // {...register("photo")}
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg, .png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px]
                leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg
                truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
          {errors.photo && <p className="text-red-300">{errors.photo}</p>}
        </div>

        <div className="mt-7">
          <button
            type="submit"
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
