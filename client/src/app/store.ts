import { combineReducers, configureStore } from "@reduxjs/toolkit";
//import thunk from 'redux-thunk';
import UserReducer from '../slices/user/userSlice';
import DoctorReducer from '../slices/doctor/doctorSlice';
import AdminReducer from '../slices/admin/adminSlice';
import DoctorListReducer from '../slices/admin/doctorListSlice';
import ApprovedDoctorListReducer from '../slices/user/doctorListSlice';
import PhoneReducer from '../slices/phoneSlice';
import UserListReducer from '../slices/admin/userListSlice';
import SingleDoctorReducer from '../slices/doctorSlice';
import AppointmentReducer from '../slices/doctor/appointmentSlice';
import PrescrtiptionReducer from '../slices/prescription';
import ReviewListReducer from '../slices/user//reviewListSlice';
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


const userPersistConfig = {
    key: 'user',
    version: 1,
    storage,
    whitelist: ['currentUser' , 'token'] 
};

const DoctorPersistConfig = {
    key: 'doctor',
    version: 1,
    storage,
    whitelist: ['currentDoctor','token'] 
};

const AdminPersistConfig = {
    key : 'admin',
    version :1,
    storage,
    whitelist:['currentAdmin' , 'token']
}

const persistedUserReducer = persistReducer(userPersistConfig, UserReducer);
const persistedDoctorReducer = persistReducer(DoctorPersistConfig,DoctorReducer);
const persistedAdminReducer = persistReducer(AdminPersistConfig,AdminReducer)

const rootReducer = combineReducers({
    user:persistedUserReducer,
    doctor:persistedDoctorReducer,
    admin:persistedAdminReducer,
    doctorList : DoctorListReducer,
    approvedDoctorList : ApprovedDoctorListReducer,
    phone:PhoneReducer,
    userList: UserListReducer,
    singleDoctor:SingleDoctorReducer,
    appointment:AppointmentReducer,
    prescription:PrescrtiptionReducer,
    reviewList:ReviewListReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware:(getDefaultMiddleware) => 
       getDefaultMiddleware({
        serializableCheck:false
       })
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);