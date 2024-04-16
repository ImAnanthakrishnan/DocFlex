import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CheckoutSuccess = () => {
  
  return (
    <div className="bg-gray-100 h-screen">
      <div className="bg-white p-6 md:mx-auto">
        {/* <svg
            viewBox='0 0 24 24'
            className='text-green-600 w-16 h-16 mx-auto my-6'>
                <path
                fill='currentColor'
                d="M12 0A12,12,0,1,0,24,12,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.
                43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,1,18.927,8.2Z">
                </path>
            </svg>*/}
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="11"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            fill="currentColor"
            d="M7.293 13.293L5.036 15.55a1 1 0 0 1-1.414-1.414l3.5-3.5a1 1 0 0 1 1.414 0L16.964 10.45a1 1 0 0 1-1.414 1.414L8.707 12.707a1 1 0 0 1-1.414-1.414l-.007.007z"
          />
        </svg>

        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for completing your secure online payment.
          </p>
          <p>Have a greate day!</p>
          <div className="py-10 text-center">
            <Link
              to="/home"
              className="px-12 bg-buttonBgColor text-white font-semibold py-3"
            >
              Go Back To Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
