import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Prescription = {
    _id:string;
    symptoms: string;
    disease: string;
    medicines: {
      name: string;
      quantity: number;
      time_gap: string;
    }[];
    testReports: {
      img: string;
    }[];
    createdAt:string;
  };

type InitialState = {
    prescription:Prescription[] | [];
    loading:boolean;
    error:string|undefined;
}

const initialState:InitialState = {
    prescription:[],
    loading:false,
    error:undefined
}

const PrescriptionSlice = createSlice({
    name:'prescription',
    initialState,
    reducers:{
        fetchPrescriptionStart:(state) => {
            state.loading = true
        },
        fetchPrescriptionSuccess:(state,action:PayloadAction<Prescription[]>)=>{
            state.prescription=action.payload;
            state.loading=false;
            state.error=undefined;
        },
        fetchPrescriptionFailed:(state,action:PayloadAction<string | undefined>)=>{
            state.loading = false;
            state.error = action.payload;
        },
        removeData:(state)=>{
            state.error=undefined;
            state.loading=false;
            state.prescription=[]
        }
    }
});




export const {fetchPrescriptionStart,fetchPrescriptionSuccess,fetchPrescriptionFailed,removeData} = PrescriptionSlice.actions;
export default PrescriptionSlice.reducer;
