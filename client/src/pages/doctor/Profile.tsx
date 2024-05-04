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

export type Doctor = {
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
    patientPerDay:string;
  }[];
  onlineTimeSlots:{
    day:string;
    startingTime: string;
    endingTime: string;
    patientPerDay:string;
  }[]
  photo?: string;
};

type ErrorType = {
  name:string;
  email:string;
  phone:string;
  bio:string;
  specialization:string;
  gender:string;
  ticketPrice:string|number;
  photo:string;
}

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
      patientPerDay:time.patientPerDay,
    })) || [{day: "", startingTime: "", endingTime: "", patientPerDay:"" }],
    onlineTimeSlots: currentDoctor?.onlineTimeSlots?.map((time:any) => ({
      day: time.day,
      startingTime: time.startingTime,
      endingTime: time.endingTime,
      patientPerDay:time.patientPerDay,
    })) || [{day: "", startingTime: "", endingTime: "", patientPerDay:"" }],
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

  const [errors, setErrors] = useState<ErrorType >({
    name: '',
    email: '',
    // password:"",
    phone: '',
    bio: '',
    gender: '',
    specialization: '',
    ticketPrice: '',
    photo: '',
  });


  const validateForm = () => {
    let valid = true;
    const newErrors:ErrorType = {...errors};

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
