import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Doctor = {
    _id:number |string;
    name:string;
    email:string;
    photo:string;
    gender:string;
    phone?:number;
    ticketPrice?:number;
    specialization?:string;
    qualification?:{}[];
    experience?:{}[];
    bio?:string;
    timeSlots?:{}[];
    onlineTimeSlots?:{}[];
    reviews?:{}[]
    averageRating?:number;
    totalRating?:number;
    isApproved?:string;
    appointments?:{}[];
    extraCharges?:number;
}

type InitialState = {
    currentDoctor: Doctor | null;
    loading:boolean;
    error:string | undefined;
    token:string | null;
}

const initialState:InitialState = {
    currentDoctor : null,
    loading:false,
    error:undefined,
    token:null
}

const DoctorSlice = createSlice({
    name:'doctor',
    initialState,
    reducers:{
        Start : (state) => {
            state.loading = true
        },
        signInSuccess: (state, action: PayloadAction<{ data: Doctor, token: string }>) => {
            state.currentDoctor = action.payload.data;
            state.token = action.payload.token;
            state.loading = false;
            state.error = undefined;
        },
        Failure: (state,action:PayloadAction<string | undefined>)=>{
            state.loading = false;
            state.error = action.payload
        },
        updateSuccess : (state,action:PayloadAction<{data:Doctor}>) => {
            state.currentDoctor = action.payload.data;
            state.loading = false;
            state.error = undefined;
        },
        signOut : (state) => {
            state.currentDoctor = null;
            state.token = null;
            state.loading = false;
            state.error = undefined;
        }
    }
});

export const {Start , signInSuccess , Failure , updateSuccess , signOut} = DoctorSlice.actions;

export default DoctorSlice.reducer;

