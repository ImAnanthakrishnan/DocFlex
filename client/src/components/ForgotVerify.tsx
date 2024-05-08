import React, { useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import { ZodType, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import { HashLoader } from 'react-spinners';

type Password = {
  password: string;
  confirmPassword: string;
};

const ForgotVerify = () => {

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const user = queryParams.get('user');

  const [formData, setFormData] = useState<Password>({ password: '', confirmPassword: '' });
 const [error,setError] = useState<boolean>(false);
 const [loading,setLoading] = useState<boolean>(false);

  let navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if(formData.confirmPassword != '' && formData.confirmPassword !== formData.password){
      setError(true);
    }else{
      setError(false);
    }
  };

  const schema: ZodType<Password> = z.object({
    password: z.string().min(5, { message: 'Password must be at least 5 characters long' }).max(20, { message: 'Password cannot exceed 20 characters' }),
    confirmPassword: z.string().min(5, { message: 'Password must be at least 5 characters long' }).max(20, { message: 'Password cannot exceed 20 characters' }),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<Password>({ resolver: zodResolver(schema) });

  const submitHandler = async(data: Password) => {
    setLoading(true);
    const storedId = localStorage.getItem('userIdForgot');

    await axios.post(`${BASE_URL}/auth/resetPassword`,{
      data,
      id:storedId,
      token,
      userRole:user
    })
    .then((res) => {
      toast.success(res.data.message);
      localStorage.removeItem('userIdForgot');
      setLoading(false);
      if(user === 'paitent'){
        navigate('/login');
      }else{
        navigate('/doctor/login');
      }
      
    })
    .catch((err) => {
      toast.error(err.response.message);
    })


  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10 text-center">
          Set New Password
        </h3>
        <form onSubmit={handleSubmit(submitHandler)} className="py-4 md:py-0">
          <div className="mb-5">
            <input
              type="password"
              {...register('password')}
              placeholder="Enter new password"
              onChange={handleInputChange}
              value={formData.password}
              name="password"
              className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            />
            {errors.password && <p className="text-red-300">{errors.password.message}</p>}
          </div>
          <div className="mb-5">
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm new password"
              onChange={handleInputChange}
              value={formData.confirmPassword}
              name="confirmPassword"
              className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            />
            {errors.confirmPassword && <p className="text-red-300">{errors.confirmPassword.message}</p>}
          </div>
          <div className="mt-7">
          <button
            type="submit"
            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
          >
            {loading ? <HashLoader size={35} color="fffff" /> : "Reset"}
          </button>
          </div>
          {error && <p className="mt-5 text-red-300 text-center">
            Please check your confirm password
          </p>}
        </form>
      </div>
    </section>
  );
};

export default ForgotVerify;
