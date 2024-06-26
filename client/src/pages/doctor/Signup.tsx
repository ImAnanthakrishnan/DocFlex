import { useState } from "react";
import signupImg from "../../assets/images/signup.gif";
//import avatar from "../../assets/images/profile.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//import googleImg from "../../assets/images/btn_google_signin_dark_pressed_web.png";
import uploadImageCloudinary from "../../utilis/uploadCloudinary";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import { useAppSelector } from "../../app/hooks";

type Doctor = {
  name: string;
  email: string;
  password: any;
  photo?: string;
  gender: string;
};

const Signup = () => {
  const { currentDoctor } = useAppSelector((data) => data.doctor);

  const { currentUser } = useAppSelector((data) => data.user);

  const { currentAdmin } = useAppSelector((data) => data.admin);

  if (currentDoctor) {
    return <Navigate to="/doctor/home" />;
  }

  if (currentUser && location.pathname.startsWith("/doctor")) {
    return <Navigate to="/home" />;
  }

  if (currentAdmin && location.pathname.startsWith("/doctor")) {
    return <Navigate to="/admin/home" />;
  }

  const [selectedFile, setSelectedFile] = useState<string | "">("");
  const [previewUrl, setPreviewUrl] = useState<string | "">("");
  const [loading, setLoading] = useState<Boolean>(false);
  const [imgError, setImgError] = useState<Boolean>(false);

  const [formData, setFormData] = useState<Doctor>({
    name: "",
    email: "",
    password: "",
    photo: selectedFile,
    gender: "",
  });

  const navigate = useNavigate();

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

      setPreviewUrl(data.url);
      setSelectedFile(data.url);
      setFormData({
        ...formData,
        photo: data.url,
      });
    }
  };

  const schema: ZodType<Doctor> = z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(30, { message: "Name cannot exceed 30 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" })
      .max(20, { message: "Password cannot exceed 20 characters" }),
    //photo: z.string().min(1,{ message: 'Please select you image' }),
    gender: z
      .string()
      .refine((value) => value === "male" || value === "female", {
        message: "Gender is required",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Doctor>({ resolver: zodResolver(schema) });

  const submitHandlerr = async (formData: Doctor) => {
    setLoading(true);
    console.log(selectedFile);
    if (selectedFile === "") {
      setLoading(false);
      return setImgError(true);
    }

    const postData = {
      formData: formData,
      selectedFile: selectedFile,
      doctor: true,
    };
    console.log(postData);

    try {
      // Make the registration request
      const registrationResponse = await axios.post(
        `${BASE_URL}/auth/register`,
        postData
      );

      const { message } = registrationResponse.data;
      setLoading(false);
      toast.success(message);

      navigate("/doctor/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  /*function navigateUrl(url:string){
    window.location.href = url
  }

  async function auth(){
    const response = await fetch(`${BASE_URL}/auth?user=${'doctor'}&status=${'register'}`,
      {method:'post'}
    );
    const data = await response.json();
    
    navigateUrl(data.url);

  }*/

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* ==== img box ====*/}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>

          {/* ==== sign up form ====*/}
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-primaryColor">account</span>
            </h3>

            <form noValidate onSubmit={handleSubmit(submitHandlerr)}>
              <div className="mb-5">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
            focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
            placeholder:text-textColor  cursor-pointer"
                />
                {errors.name && (
                  <p className="text-red-300">{errors.name.message}</p>
                )}
              </div>

              <div className="mb-5">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
            focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
            placeholder:text-textColor  cursor-pointer"
                />
                {errors.email && (
                  <p className="text-red-300">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-5">
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
            focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
            placeholder:text-textColor  cursor-pointer"
                />
                {errors.password &&
                  typeof errors.password.message === "string" && (
                    <p className="text-red-300">{errors.password.message}</p>
                  )}
              </div>

              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlFor=""
                  className="text-headingColor font-bold text-[16px] leading-7"
                >
                  Gender:
                  <select
                    {...register("gender")}
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
                  <p className="text-red-300">{errors.gender.message}</p>
                )}
              </div>

              <div className="mb-5 flex items-center gap-3">
                {selectedFile && (
                  <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt=""
                      className="w-full rounded-full"
                    />
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
              {imgError && (
                <p className="text-red-300">Please select your image</p>
              )}
              <div className="mt-7">
                <button
                  disabled={loading && true}
                  type="submit"
                  className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                >
                  {loading ? <HashLoader size={35} color="fffff" /> : "Sign Up"}
                </button>
              </div>
             {/* <p className="text-center text-headingColor mt-2">or</p>
              <div className="flex justify-center">
                <button className="mt-3" type="button" onClick={() => auth()}>
                  <img src={googleImg} alt="google sign in" />
                </button>
              </div>*/}
              <p className="mt-5 text-textColor text-center">
                Already have an account?{" "}
                <Link
                  to="/doctor/login"
                  className="text-primaryColor font-medium ml-1"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
