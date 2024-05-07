import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Data = {
    patients:number;
    doctors:number;
    bookings:number;
    cancelled:number;
    barChartData:{
        month:string,
        approved:number,
        cancelled:number
    }[];
    lineChartData:{
        month: string;
        ticketPrice: number;
        extraCharges: number;
        totalCharges: number;
    }[]

}

type DataState = {
    dashData : Data | null,
    loading:boolean;
    error:string | undefined;
}

const initialState:DataState = {
    dashData:null,
    loading:false,
    error:undefined,
}

const DashDataSlice = createSlice({
    name:'dashData',
    initialState,
    reducers:{
        Start:(state) => {
            state.loading = true
        },
        Success : (state,action:PayloadAction<Data>) => {
            state.dashData = action.payload;
            state.loading = false,
            state.error = undefined
        },
        Failed:(state,action:PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = action.payload
        }
    }
});

export const {Start,Success,Failed} = DashDataSlice.actions;

export default DashDataSlice.reducer;