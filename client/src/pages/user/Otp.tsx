import {  useRef, useEffect,useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { BASE_URL } from "../../config";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { phoneComplete } from "../../slices/phoneSlice";
type FormValues = {
  otp: string[] ;
};

const validate = (values: FormValues) => {

  const errors: Partial<FormValues> = {}; // Initialize errors as a Partial<FormValues> object

  if (values.otp.some(value => value === '')) {
    errors.otp = ['All OTP fields are required'];
  }

  return errors;
};

const Otp = () => {

  const {currentUser} = useAppSelector(state => state.user);

  const {currentDoctor} = useAppSelector(state => state.doctor);

  const {currentAdmin} = useAppSelector(state => state.admin);

  const location = useLocation();

  if(currentUser){
    return <Navigate to='/home' />
  }

  if((currentDoctor && !location.pathname.startsWith('/doctor')) || (currentDoctor && !location.pathname.startsWith('/admin'))){
    return <Navigate to='/doctor/home' />
}

if((currentAdmin && !location.pathname.startsWith('/doctor')) || (currentAdmin && !location.pathname.startsWith('/admin'))){
  return <Navigate to='/admin/home' />
}

  const [timer, setTimer] = useState<number>(60);
  const [showResend, setShowResend] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const {details} = useAppSelector((data)=>data.phone);
const email = details?.email;
const phone = details?.phone;

  if(!details){
     navigate(-1);
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      otp:  ["", "", "", "", "", ""] // Initialize otp as an array of empty strings
    },
    validate,
    onSubmit: async(values) => {
    const otp = values.otp.join("");
   axios.post(`${BASE_URL}/auth/verify-otp`, {otp , phone,email})
    .then((res) => {
      const { message } = res.data;
     
      toast.success(message);
      dispatch(phoneComplete());
      navigate("/login");
      toast.success('Please login');
    })
    .catch((err) => {
      const { message } = err.response.data;
      toast.error(message);
      
    });
    }
  });
  
  const inputRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setShowResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);


  const handleResend = async() => {
    if (typeof phone === 'string') {
    await axios.post(`${BASE_URL}/auth/send-otp`, {countryCode:phone.substring(0, 3),phone:phone.substring(3),email})
    .then(res=>{
      toast.success(res.data.message)
    })
    .catch(error=>{ 
      const { message } = error.response.data;
      toast.error(message);
    });
    }
    setTimer(60); // Reset the timer to 60 seconds
    setShowResend(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/[a-z]/gi.test(value)) return;

    const currentOtp = [...formik.values.otp]; // currentOtp is now correctly inferred as string[]

    currentOtp[index] = value.slice(-1);

    formik.setValues(prev => ({
      ...prev,
      otp: currentOtp // Update otp with modified currentOtp array
    }));

    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleBackSpace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (index > 0) {
        inputRef.current[index - 1]?.focus();
      }
    }
  };



  const renderInput = () => {
    return (
      <div className="flex justify-center items-center"> 
        {formik.values.otp.map((value, index) => (
          <input
            key={index}
            ref={(ele) => (inputRef.current[index] = ele as HTMLInputElement)}
            value={value}
            type="text"
            name={`${index}`} 
            className="w-16 h-12 rounded-md mr-3 text-center text-xl border border-[#181A1E]"
            onChange={(e) => handleChange(e, index)}
            onKeyUp={(e) => handleBackSpace(e, index)}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex justify-center items-center h-full flex-col mb-40">
      <form onSubmit={formik.handleSubmit} className="flex flex-col items-center">
        <h3 className="text-3xl mb-8 mt-3 text-center">Please Fill The OTP</h3>
        {renderInput()}
        <div className="mt-4">
          {showResend ? (
            <button type="button" onClick={handleResend} className="w-32 bg-[#cecda3] border border-solid rounded hover:bg-[#636c44] hover:border-[#daf7c1] mr-2">
              Resend
            </button>
          ) : (
            <p className="text-center">{`Resend OTP in ${timer} seconds`}</p>
          )}
          <button type="submit" className="w-32 bg-[#cbcdde] border border-solid rounded hover:bg-[#535158] hover:border-[#222128]">
            Submit
          </button>
        </div>
      </form>
      {formik.errors.otp && <p className="mt-3 text-sm text-red-400">Please fill the fields</p>}
    </div>
  );
  
};

export default Otp;
