import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import  { Doctor as Doctor1 } from "../doctor/doctorSlice";

interface Doctor extends Doctor1{
    createdAt : string;
}

type DoctorListState = {
    doctorList : Doctor[] | [];
    loading: boolean;
    error : string | undefined;
}

const initialState : DoctorListState = {
    doctorList :[],
    loading :false,
    error:undefined,
   
}

const DoctorListSlice = createSlice({
    name:'doctorList',
    initialState,
    reducers : {
        fetchDoctorStart : (state) => {
            state.loading = true;
            state.error = undefined;
        },
        fetchDoctorListSuccess : (state,action:PayloadAction<any[]>) => {
            state.loading = false;
            state.doctorList = action.payload.map(item => item._doc);
        },
        fetchDoctorListFailed : (state,action:PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = action.payload
        }
    }
})

export const {fetchDoctorStart , fetchDoctorListSuccess , fetchDoctorListFailed} = DoctorListSlice.actions;

export default DoctorListSlice.reducer;