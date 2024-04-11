import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type User = {
   
        _id:number |string;
        name:string;
        email:string;
        photo:string;
        gender:string;
        is_verified:boolean;
        phone:string|number;
        createdAt:string
}

type UserListState = {
    userList : User[] | [];
    loading: boolean;
    error : string | undefined;
}

const initialState : UserListState = {
    userList :[],
    loading :false,
    error:undefined,
   
}

const UserListSlice = createSlice({
    name:'userList',
    initialState,
    reducers : {
        fetchDoctorStart : (state) => {
            state.loading = true;
            state.error = undefined;
        },
        fetchDoctorListSuccess : (state,action:PayloadAction<any[]>) => {
            state.loading = false;
            state.userList = action.payload.map(item => item._doc);
        },
        fetchDoctorListFailed : (state,action:PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = action.payload
        }
    }
})

export const {fetchDoctorStart , fetchDoctorListSuccess , fetchDoctorListFailed} = UserListSlice.actions;

export default UserListSlice.reducer;