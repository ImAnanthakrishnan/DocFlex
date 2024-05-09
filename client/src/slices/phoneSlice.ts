import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type data = {
    phone:string | '' | number;
    email:string | '';
}
type InitialState = {
    details:data | null
}

const initialState : InitialState = {
    details : null
}

const PhoneSlice = createSlice({
    name:'phone',
    initialState,
    reducers:{
        phoneSuccess:(state,action:PayloadAction<data>) => {
            state.details = action.payload
        },
        phoneComplete:(state) => {
            state.details = null
        }
    }
});

export const {phoneSuccess , phoneComplete} = PhoneSlice.actions;
export default PhoneSlice.reducer;
