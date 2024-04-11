import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type User = {
    _id:number |string;
    name:string;
    email:string;
    photo:string;
    gender:string;
}

type InitialState = {
    currentUser: User | null;
    loading:boolean;
    error:string | undefined;
    token:string | null
}

const initialState:InitialState = {
    currentUser : null,
    loading:false,
    error:undefined,
    token:null
}

const UserSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart : (state) => {
            state.loading = true
        },
        signInSuccess : (state,action:PayloadAction<{ data: User, token: string }>) => {
            state.currentUser = action.payload.data;
            state.token = action.payload.token
            state.loading = false;
            state.error = undefined;
        },
        signInFailure: (state,action:PayloadAction<string | undefined>)=>{
            state.loading = false;
            state.error = action.payload
        },
        signOut : (state) => {
            state.currentUser = null;
            state.token = null;
            state.loading = false;
            state.error = undefined;
        }
    }
});

export const {signInStart , signInSuccess , signInFailure ,signOut} = UserSlice.actions;

export default UserSlice.reducer;

