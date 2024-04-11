import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type InitialState = {
    phone:string | '' | number
}

const initialState : InitialState = {
    phone:''
}

const PhoneSlice = createSlice({
    name:'phone',
    initialState,
    reducers:{
        phoneSuccess:(state,action:PayloadAction<string | number>) => {
            state.phone = action.payload
        },
        phoneComplete:(state) => {
            state.phone = ''
        }
    }
});

export const {phoneSuccess , phoneComplete} = PhoneSlice.actions;
export default PhoneSlice.reducer;
