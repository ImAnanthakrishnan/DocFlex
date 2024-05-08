import React, { useEffect, useState } from "react";

//import avatar from "../../assets/images/profile.png";

import axios from "axios";


import uploadImageCloudinary from "../../../utilis/uploadCloudinary";

import { BASE_URL } from "../../../config";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { signInFailure,  updateSuccess } from "../../../slices/user/userSlice";

type User = {
  name?: string;
  email?: string;
  password?: any;
  phone?: number | string;
  photo?: string;
  gender?: string;
  countryCode?: string;
};


const Profile = () => {
  const [selectedFile, setSelectedFile] = useState<string | "">("");
  console.log(selectedFile)
  const {token,currentUser} = useAppSelector(data=>data.user);



  const [loading, setLoading] = useState<Boolean>(false);
  //const [imgError, setImgError] = useState<Boolean>(false);

  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    password: "",
    phone: "",
    photo: "",
    gender: "",
  });

  useEffect(()=>{
    setFormData({
      name: currentUser?.name,
      email: currentUser?.email,
      phone: currentUser?.phone,
      photo: currentUser?.photo,
      gender: currentUser?.gender,
    })
  },[]);

  const [errors,setErrors] = useState<User>({
    name:'',
    email:'',
    phone:'',
    gender:'',
    photo:''
  })

  //const navigate = useNavigate();
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

     
      setSelectedFile(data.url);
      setFormData({
        ...formData,
        photo: data.url,
      });
    }
  };



 /* const schema = z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(30, { message: "Name cannot exceed 30 characters" }),
    email: z.string().email({ message: "Invalid email format" }),

    phone: z
      .string()
      .length(10, { message: "Phone number must be exactly 10 digits" })
      .regex(/^\d+$/, { message: "Phone must contain only numbers" }),
    //photo: z.string().min(1,{ message: 'Please select you image' }),
    gender: z
      .string()
      .refine((value) => value === "male" || value === "female", {
        message: "Gender is required",
      }),
    countryCode: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { ...errors },
  } = useForm<User>({ resolver: zodResolver(schema) });*/


  const authToken = {
    headers:{
      Authorization:`Bearer ${token}`
    }
   }

   const validateForm = () => {
    let valid = true;
    const newErrors:User = {...errors};

    if(!formData.name){
      newErrors.name = 'name is required';
      valid = false;
    }else {
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
    } else if (!/^(\+91)?\d{10,12}$/.test(String(formData.phone))) {
      newErrors.phone = 'Phone number must be between 10 to 12 digits and may start with +91';
      valid = false;
    } else {
      newErrors.phone = '';
    }
    

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      valid = false;
    } else {
      newErrors.gender = '';
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

  const submitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!validateForm()){
      return;
    }

    setLoading(true);


    
    try {
      // Make the registration request
      const registrationResponse = await axios.put(
        `${BASE_URL}/user/${currentUser?._id}`,
       { formData},authToken
      );
      const { message,data } = registrationResponse.data;
      setLoading(false);
      dispatch(updateSuccess({ data }));
      toast.success(message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      dispatch(signInFailure(error.response?.data?.message))
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <form noValidate onSubmit={submitHandler}>
        <div className="mb-5">
          <input
            type="text"
      
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
              placeholder:text-textColor  cursor-pointer"
          />
          {errors.name && <p className="text-red-300">{errors.name}</p>}
        </div>

        <div className="mb-5">
          <input
            type="email"
            
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
              placeholder:text-textColor  cursor-pointer"
          />
          {errors.email && (
            <p className="text-red-300">{errors.email}</p>
          )}
        </div>

        <div className="mb-5">
          <div className="flex items-center mb-2">
            
            <input
              type="text"
              
              placeholder="Enter your phone number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
            focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
            placeholder:text-textColor cursor-pointer"
            />
          </div>
          {errors.phone && (
            <p className="text-red-300">{errors.phone}</p>
          )}
        </div>

        <div className="mb-5">
          <input
            type="password"
         
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
              placeholder:text-textColor  cursor-pointer"
          />

        </div>

        <div className="mb-5 flex items-center justify-between">
          <label
            htmlFor=""
            className="text-headingColor font-bold text-[16px] leading-7"
          >
            Gender:
            <select
            
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          {errors.gender && (
            <p className="text-red-300">{errors.gender}</p>
          )}
        </div>

        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img src={formData.photo} alt="" className="w-full rounded-full" />
            </figure>
          )}

          <div className="relative w-[160px] h-[50px]">
            <input
              type="file"
              //{...register("photo")}
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
        </div>
        {errors.photo && <p className="text-red-300">{errors.photo}</p>}
        <div className="mt-7">
          <button
            disabled={loading && true}
            type="submit"
            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
          >
            {loading ? <HashLoader size={25} color="fffff" /> : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
