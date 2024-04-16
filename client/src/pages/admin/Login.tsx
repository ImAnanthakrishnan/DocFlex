import { useState } from "react";
import logo from "../../assets/images/Screenshot (257).png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Start,
  signInSuccess,
  Failure,
} from "../../slices/admin/adminSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axios from "axios";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HashLoader } from "react-spinners";
import backgroundImage from '../../assets/images/Background.png';
type Admin = {
  email: string;
  password: any;
};

const Login = () => {
  const { loading,currentAdmin } = useAppSelector((state) => state.admin);

  const { currentUser } = useAppSelector((state) => state.user);

  const { currentDoctor } = useAppSelector((state) => state.doctor);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

 if(currentAdmin){
  return <Navigate to='/admin/home' />
 }

 if( (currentUser && location.pathname.startsWith('/admin'))){
  return <Navigate to='/home' />
}

if( (currentDoctor && location.pathname.startsWith('/admin'))){
  return <Navigate to='/doctor/home' />
}



  const [formData, setFormData] = useState<Admin>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const schema:ZodType<Admin> = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" })
      .max(20, { message: "Password cannot exceed 20 characters" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Admin>({ resolver: zodResolver(schema) });


console.log(formData)
  const submitHandler = async (formData : Admin) => {
    //e.preventDefault();

    dispatch(Start());
   
    await axios
      .post(`${BASE_URL}/auth/admin-login`, formData)
      .then((res:any) => {
        
        const { data, message , token } = res.data;
       // console.log(token)
        dispatch(signInSuccess({ data, token }));
        toast.success(message);
        navigate("/admin/home");
      })
      .catch((err) => {
        const {message} = err.response?.data || 'An error occured'
        dispatch(Failure(message));
        toast.error(message);
      });
  };

  return (
    <section className="px-5 lg:px-0 w-full " style={{ backgroundImage: `url(${backgroundImage})`, height:'100vh' }}>
    <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10" >
      <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
        Hello! <span className="text-primaryColor">Welcome</span>Back Admin🧑‍🦰
      </h3>
      <form onSubmit={handleSubmit(submitHandler)} className="py-4 md:py-0" style={{backgroundImage:'url(../../assets/images/Background.png)'}}>
        <div className="mb-5">
          <input
            type="email"
            {...register("email")}
            placeholder="Enter Your Email"
            onChange={handleInputChange}
            value={formData.email}
            name="email"
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none
            focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
            placeholder:text-textColor  cursor-pointer bg-transparent"
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
            onChange={handleInputChange}
            value={formData.password}
            name="password"
            className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
            focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
            placeholder:text-textColor  cursor-pointer bg-transparent"
          />
          {errors.password && typeof errors.password.message === "string" && (
            <p className="text-red-300">{errors.password.message}</p>
          )}
        </div>

        <div className="mt-7">
          <button
            type="submit"
            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
          >
            {loading ? <HashLoader size={35} color="fffff" /> : "Login"}
          </button>
        </div>
      {/*  <p className="mt-5 text-textColor text-center">
          Don&apos;t have an account?{" "}
          <Link to="/doctor/register" className="text-primaryColor font-medium ml-1">
            Register
          </Link>
        </p> */}
      </form>
    </div>
  </section>
  );
};

export default Login;