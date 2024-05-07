import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../slices/user/userSlice";
import googleImg from "../../assets/images/btn_google_signin_dark_pressed_web.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axios from "axios";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HashLoader } from "react-spinners";
import Error from "../../components/Error";

type User = {
  email: string;
  password: any;
};

const Login = () => {
  const { loading, currentUser } = useAppSelector((state) => state.user);
  const { currentDoctor } = useAppSelector((state) => state.doctor);
  const { currentAdmin } = useAppSelector((state) => state.admin);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const [google,setGoogle] = useState<boolean>(false);

  useEffect(() => {
    
    const email = new URLSearchParams(window.location.search).get("email");

    //dispatch(signInStart());
    if (email) {
      setGoogle(true);
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/auth/getUser?email=${email}&type=${'patient'}`);

          const { data, message, token } = response.data;
          dispatch(signInSuccess({ data, token }));
          toast.success(message);
          setGoogle(false);
          navigate("/home");
        } catch (err: any) {
          const { message } = err.response.data;
          dispatch(signInFailure(message));
          toast.error(message);
        }
      };
      fetchUserData();
    }
  }, []);

  if (currentUser) {
    return <Navigate to="/home" />;
  }

  if (
    (currentDoctor && !location.pathname.startsWith("/doctor")) ||
    (currentDoctor && !location.pathname.startsWith("/admin"))
  ) {
    return <Navigate to="/doctor/home" />;
  }

  if (
    (currentAdmin && !location.pathname.startsWith("/doctor")) ||
    (currentAdmin && !location.pathname.startsWith("/admin"))
  ) {
    return <Navigate to="/admin/home" />;
  }

  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const schema: ZodType<User> = z.object({
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
  } = useForm<User>({ resolver: zodResolver(schema) });

  const submitHandler = async (formData: User) => {
    // e.preventDefault();

    dispatch(signInStart());

    await axios
      .post(`${BASE_URL}/auth/login`, formData)
      .then((res) => {
        const { data, message, token } = res.data;
        dispatch(signInSuccess({ data, token }));
        toast.success(message);
        navigate("/home");
      })
      .catch((err) => {
        const { message } = err.response.data;

        dispatch(signInFailure(message));
        toast.error(message);
      });
  };

  function navigateUrl(url:string){
    window.location.href = url
  }

  async function auth(){
    const response = await fetch(`${BASE_URL}/auth`,
      {method:'post'}
    );
    const data = await response.json();
    
    navigateUrl(data.url);

  }

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-primaryColor">Welcome</span> Back 🎉
        </h3>
        {google ? (
          <Error />
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit(submitHandler)}
            className="py-4 md:py-0"
          >
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
                onChange={handleInputChange}
                value={formData.password}
                name="password"
                className="w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[22px] leading-7 text-headingColor
              placeholder:text-textColor  cursor-pointer"
              />
              {errors.password &&
                typeof errors.password.message === "string" && (
                  <p className="text-red-300">{errors.password.message}</p>
                )}
            </div>

            <div className="mt-7">
              <button
                type="submit"
                className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
              >
                {loading ? <HashLoader size={35} color="#ffffff" /> : "Login"}
              </button>
            </div>
            <p className="text-center text-headingColor mt-2">or</p>
            <div className="flex justify-center">
            <button className="mt-3" type="button" onClick={() => auth()}>
                  <img  src={googleImg} alt="google sign in" />
            </button>
            </div>
            <p className="mt-5 text-textColor text-center">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-primaryColor font-medium ml-1"
              >
                Register
              </Link>
            </p>
            <p className="mt-5 text-textColor text-center">
              Forgot password?{" "}
              <Link
                to={`/forgotVerify?user=${'patient'}`}
                className="text-primaryColor font-medium ml-1"
              >
                Forgot
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default Login;
