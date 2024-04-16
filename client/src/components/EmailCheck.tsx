import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HashLoader } from "react-spinners";

type Email = {
  email: string;
};

const EmailCheck = () => {
  const [formData, setFormData] = useState<Email>({ email: "" });

  const [loading, setLoading] = useState<boolean>(false);

  /// const inputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get("user");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const schema: ZodType<Email> = z.object({
    email: z.string().email({ message: "Invalid email format" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Email>({ resolver: zodResolver(schema) });

  const submitHandler = async (formData: Email) => {
    setLoading(true);

    await axios
      .post(`${BASE_URL}/auth/forgot-verify`, { email: formData, user })
      .then((res) => {
        localStorage.setItem("userIdForgot", JSON.stringify(res.data.id));
        toast.success(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.message);
      });
  };

  return (
    <section className="px-5 lg:px-0 ">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10 text-center">
          Send Email
        </h3>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="py-4 md:py-0"
          style={{ backgroundImage: "url(../../assets/images/Background.png)" }}
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
          <div className="mt-7">
            <button
              type="submit"
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
            >
              {loading ? <HashLoader size={35} color="fffff" /> : "Send"}
            </button>
          </div>
          {user === "patient" ? (
            <p className="mt-5 text-textColor text-center">
              Want to go back to login?{" "}
              <Link to="/login" className="text-primaryColor font-medium ml-1">
                Login
              </Link>
            </p>
          ) : (
            <p className="mt-5 text-textColor text-center">
              Want to go back to login?{" "}
              <Link
                to="/doctor/login"
                className="text-primaryColor font-medium ml-1"
              >
                Login
              </Link>
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default EmailCheck;
