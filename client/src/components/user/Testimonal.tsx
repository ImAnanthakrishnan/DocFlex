import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HiStar } from "react-icons/hi";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchReviewFailed,
  fetchReviewStart,
  fetchReviewSuccess,
} from "../../slices/user/reviewListSlice";
import { BASE_URL } from "../../config";
import axios from "axios";


const Testimonal = () => {

    const dispatch = useAppDispatch();
   // const { token } = useAppSelector((state) => state.user);

    /*const authToken = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };*/

    useEffect(() => {
        const fetchReviews = async () => {
            dispatch(fetchReviewStart());
      
            await axios
              .get(`${BASE_URL}/reviews/`)
              .then((res: any) => {
                
                dispatch(fetchReviewSuccess(res.data.data));
              })
              .catch((err: any) => {
                dispatch(fetchReviewFailed(err.response.data.message));
               // toast.error(err.response.data.message);
              });
          };
      
          fetchReviews();
    },[]);

    const { reviewList } = useAppSelector(
        (state) => state.reviewList
      );
    console.log('review-',reviewList)
  return (
    <div className="mt-[30px] lg:mt-[55px]">
      <Swiper
        modules={[Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {reviewList?.map((review,index)=>(
        <SwiperSlide key={index}>
        <div className="py-[30px] px-5 rounded-3">
          <div className="flex items-center gap-[13px]">
            <img src={review.user.photo} alt={review.user.name} />
            <div>
              <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                  {review.user.name}
              </h4>
              <div className="flex items-center gap-[2px]">
                  <HiStar className="text-yellowColor w-[18px] h-5" />
              </div>
            </div>
          </div>
          <p className="text-[16px] leading-7 mt-4 text-textColor font-[400]">
              {review.reviewText}
          </p>
        </div>
      </SwiperSlide>
        ))
       }
      </Swiper>
    </div>
  );
};

export default Testimonal;
