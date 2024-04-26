import React, { useEffect } from "react";
import avatar from "../../../assets/images/profile.png";
import { AiFillStar } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchReviewFailed,
  fetchReviewStart,
  fetchReviewSuccess,
} from "../../../slices/user/reviewListSlice";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
import axios from "axios";
import convertTime from "../../../utilis/convertTime";
import Loader from "../../../components/Loader";
import Error from "../../../components/Error";

type PropsType = {
  reviews?: {}[];
  totalRating?: number;
  doctorId: string | undefined | number;
};

const Feedback = ({ reviews, totalRating, doctorId }: PropsType) => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);

  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch(fetchReviewStart());

      await axios
        .get(`${BASE_URL}/doctors/${doctorId}/reviews`, authToken)
        .then((res: any) => {
          
          dispatch(fetchReviewSuccess(res.data.data));
        })
        .catch((err: any) => {
          dispatch(fetchReviewFailed(err.response.data.message));
          toast.error(err.response.data.message);
        });
    };

    fetchReviews();
  }, []);

  const { loading, error, reviewList } = useAppSelector(
    (state) => state.reviewList
  );

  return (
    <div>
      {loading && !error && <Loader/>}
      {error && !loading && <Error errorMessage={error}/>}
     {!loading && !error && <div className="mb-[50px]">
        <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]">
          All reviews ({totalRating})
        </h4>
        {reviewList?.map((review, index) => (
          <div key={index} className="flex justify-between gap-10 mb-[30px]">
            <div className="flex gap-3">
              <figure className="w-10 h-10 rounded-full">
                <img className="w-full" src={review.user.photo} alt="" />
              </figure>
              <div>
                <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                  {review.user.name}
                </h5>
                <p className="text-[14px] leading-6 text-textColor">
                  {new Date(review.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <p className="text__para mt-3 font-medium text-[15px]">
                  {review.reviewText}
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              {[...Array(review.rating).keys()].map((_, index) => (
                <AiFillStar key={index} color="#0067FF" />
              ))}
            </div>
          </div>
        ))}
      </div>
      }
    </div>
  );
};

export default Feedback;
