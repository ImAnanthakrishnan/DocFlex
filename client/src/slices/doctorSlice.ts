import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Doctor } from "./doctor/doctorSlice";

type InitialState = {
    singleDoctor: Doctor | null;
    loading:boolean;
    error:string | undefined;
    token:string | null;
}

const initialState:InitialState = {
    singleDoctor : null,
    loading:false,
    error:undefined,
    token:null
}

const SingleDoctorSlice = createSlice({
    name:'singledoctor',
    initialState,
    reducers:{
        Start : (state) => {
            state.loading = true
        },
        Success: (state, action: PayloadAction<Doctor>) => {
            state.singleDoctor = action.payload;
            state.loading = false;
            state.error = undefined;
        },
        Failure: (state,action:PayloadAction<string | undefined>)=>{
            state.loading = false;
            state.error = action.payload
        },
        updateSuccess : (state,action:PayloadAction<Doctor>) => {
            state.singleDoctor = action.payload;
            state.loading = false;
            state.error = undefined;
        },
    }
});

export const {Start , Success , Failure , updateSuccess } = SingleDoctorSlice.actions;

export default SingleDoctorSlice.reducer;

