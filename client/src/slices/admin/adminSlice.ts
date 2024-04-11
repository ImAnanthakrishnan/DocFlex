import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Admin = {
    _id:number |string;
    name:string;
    email:string;
    photo:string
}

type InitialState = {
    currentAdmin: Admin | null;
    loading:boolean;
    error:string | undefined;
    token:string | null;
}

const initialState:InitialState = {
    currentAdmin : null,
    loading:false,
    error:undefined,
    token:null
}

const AdminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        Start : (state) => {
            state.loading = true
        },
        signInSuccess: (state, action: PayloadAction<{ data: Admin, token: string }>) => {
            state.currentAdmin = action.payload.data;
            state.token = action.payload.token;
            state.loading = false;
            state.error = undefined;
        },
        Failure: (state,action:PayloadAction<string | undefined>)=>{
            state.loading = false;
            state.error = action.payload
        },
       /* updateSuccess : (state,action:PayloadAction<{data:Admin}>) => {
            state.currentAdmin = action.payload.data;
            state.loading = false;
            state.error = undefined;
        },*/
        signOut : (state) => {
            state.currentAdmin = null;
            state.token = null;
            state.loading = false;
            state.error = undefined;
        }
    }
});

export const {Start , signInSuccess , Failure ,   signOut} = AdminSlice.actions;

export default AdminSlice.reducer;
