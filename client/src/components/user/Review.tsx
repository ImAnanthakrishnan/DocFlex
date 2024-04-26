import React, { useState } from "react";
import { AiFillStar } from "react-icons/ai";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import {
  fetchReviewFailed,
  fetchReviewStart,
  fetchReviewSuccess,
} from "../../slices/user/reviewListSlice";
import { HashLoader } from "react-spinners";
import axios from "axios";

type PropsType = {
  doctorId: string;
};

const Review = ({ doctorId }: PropsType) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);

  const authToken = {
    headers:{
     Authorization: `Bearer ${token}`
    }
  }

  const handleSubmitReview = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

  
      if (!rating || !reviewText) {
        return toast.error("Rating & Review Fields are required");
      }
      dispatch(fetchReviewStart());

      await axios.post(`${BASE_URL}/doctors/${doctorId}/reviews`,{
        rating,reviewText
      },authToken)
      .then((res)=>{
        dispatch(fetchReviewSuccess(res.data.data));
        toast.success(res.data.message);
      })
     .catch((err)=>{
      dispatch(fetchReviewFailed(err.response.data.message));
      toast.error(err.response.data.message);
     })
    }

  const { loading } = useAppSelector((state) => state.reviewList);

  return (
    <form action="">
      <div>
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          How would you rate the overall experience?*
        </h3>
        <div>
          {[...Array(5).keys()].map((_, index) => {
            index+=1;
            return (
              <button
                key={index}
                type="button"
                className={`${
                  index <= ((rating && hover) || hover)
                    ? "text-yellowColor"
                    : "text-gray-400"
                } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[30px]">
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          Share your feedback or suggestions*
        </h3>
        <textarea
          className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor
          w-full px-4 rounded-md"
          placeholder="Write your message"
          onChange={(e) => setReviewText(e.target.value)}
          rows={5}
        ></textarea>
      </div>
      <button type="submit" onClick={handleSubmitReview} className="btn">
        {loading ? <HashLoader size={25} color="#fff" /> : "Submit Feedback"}
      </button>
    </form>
  );
};

export default Review;
