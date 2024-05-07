import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import  { Doctor as Doctor1 } from "../doctor/doctorSlice";

interface Doctor extends Doctor1{
    createdAt : string;
    appointmentDate?:{
        day:string;
        startingTime:string;
        endingTime:string;
        date:string;
    },
    modeOfAppointment:string;
    status?:string;
    bookingId?:string
}

type DoctorListState = {
    approvedDoctorList : Doctor[] | [];
    loading: boolean;
    error : string | undefined;
}

const initialState : DoctorListState = {
    approvedDoctorList :[],
    loading :false,
    error:undefined,
   
}

const ApprovedDoctorListSlice = createSlice({
    name:'approvedDoctorList',
    initialState,
    reducers : {
        fetchDoctorStart : (state) => {
            state.loading = true;
            state.error = undefined;
        },
        fetchDoctorListSuccess : (state,action: PayloadAction<any[]>) => {
            state.loading = false;
            state. approvedDoctorList = action.payload;
        
        },
        fetchDoctorListFailed : (state,action:PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = action.payload
        },
        clear : (state) => {
            state.approvedDoctorList = []
        }
    }
})

export const {fetchDoctorStart , fetchDoctorListSuccess , fetchDoctorListFailed , clear} = ApprovedDoctorListSlice.actions;

export default ApprovedDoctorListSlice.reducer;