import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Review = {
    user: {
      name: string;
      photo: string;
    };
    reviewText: string;
    rating: number;
    createdAt:string
  };
  
  type ReviewListSlice = {
    reviewList: Review[];
    loading: boolean;
    error: string | undefined;
  };
  
  const initialState: ReviewListSlice = {
    reviewList: [],
    loading: false,
    error: undefined,
  };

  const ReviewListSlice = createSlice({
    name:'reviewList',
    initialState,
    reducers:{
        fetchReviewStart:(state) => {
            state.loading = true;
            state.error=undefined;
        },
        fetchReviewSuccess:(state,action:PayloadAction<any[]>)=>{
            state.loading=false;
            state.reviewList = action.payload
        },
        fetchReviewFailed:(state,action:PayloadAction<string|undefined>)=>{
            state.loading = false;
            state.error = action.payload
        }
    }
  });

  export const {fetchReviewStart,fetchReviewSuccess,fetchReviewFailed} = ReviewListSlice.actions;

  export default ReviewListSlice.reducer;


