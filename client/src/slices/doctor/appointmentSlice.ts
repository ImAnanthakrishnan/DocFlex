import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type Appointment = {
    name:string;
    gender:string;
    email:string;
    photo:string
    isPaid:boolean;
    ticketPrice:number
    createdAt:string;
} 

type InitialState = {
    appointments:Appointment[] | [];
    loading:boolean;
    error:string|undefined;
}

const initialState:InitialState = {
    appointments:[],
    loading:false,
    error:undefined
}

const AppointmentSlice = createSlice({
    name:'appointment',
    initialState,
    reducers:{
        fetchAppointmentStart:(state) => {
            state.loading=true
        },
        fetchAppointmentSuccess:(state,action:PayloadAction<Appointment[]>)=>{
            state.appointments = action.payload;
            state.loading=false;
            state.error=undefined;
        },
        fetchAppointmentFailed : (state,action:PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = action.payload
        }
    }
});

export const {fetchAppointmentStart , fetchAppointmentSuccess , fetchAppointmentFailed} = AppointmentSlice.actions;

export default AppointmentSlice.reducer;