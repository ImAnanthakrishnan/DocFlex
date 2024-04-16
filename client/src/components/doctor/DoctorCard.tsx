import { FaArrowRight } from "react-icons/fa6";
import { doctors } from "../../assets/doctors";
import StartIcon from "../../assets/images/Star.png";
import { Link } from "react-router-dom";
import { useState } from "react";

type Doctor = {
  doctor: {
    _id: string | number;
    name: string;
    specialization: string;
    avgRating: number;
    totalRating: number;
    photo: string;
    totalPatients: number;
    hospital: string;
    experience: string[];
  };
};

const DoctorCard = ({ doctor, booking  }: any) => {
  const {
    _id,
    name,
    averageRating,
    totalRating,
    photo,
    specialization,
    experience,
  } = doctor;

  console.log("docto-", doctor);

  





  return (
    <div className="p-3 lg:p-5">
      <img src={photo} className="w-full" alt="" />

      <h2
        className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor
    font-[700] mt-3 lg:mt-5"
      >
        {name}
      </h2>
      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span
          className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 
        lg:text-[16px] lg:leading-7 font-semibold rounded"
        >
          {specialization}
        </span>
        <div className="flex items-center gap-[6px]">
          <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
            <img src={StartIcon} alt="" /> {averageRating}
          </span>

          <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-400 text-textColor">
            ({totalRating})
          </span>
        </div>
      </div>
      <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
        <div>
          {/* <h3 className="text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor">
                +{totalPatients} patients
  </h3> */}
          <p className="text-[14px] leading-6 font-[400] text-textColor">
            At {experience && experience?.[0]?.hospital}
          </p>
        </div>

        {booking ? (
          <p>cancel</p>
        ) : (
          <Link
            to={`/find-doctors/${_id}`}
            className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-30px mx-auto flex item-center justify-center group hover:bg-primaryColor hover:border-none"
          >
            <FaArrowRight className="group-hover:text-white w-6 h-6 mt-2 " />
          </Link>
        )}
      </div>

    </div>
  );
};

export default DoctorCard;
