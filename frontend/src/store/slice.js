import { createSlice } from "@reduxjs/toolkit";

const initialState={
    status:false,
    userData:null,
    tasks:[],
    filterTasks:[]
}


const Slice = createSlice({
    name:"task",
    initialState,
    reducers:{
        authLogin:(state,action)=>{
            state.status= true;
            state.userData = action.payload;
        },
        authLogout:(state)=>{
            state.status = false;
            state.userData = null;
        },
        handleTasks:(state,action)=>{
            state.tasks = action.payload;
        },
        handleFilterTasks:(state,action)=>{
            state.filterTasks = action.payload;
        },
    }
})

const {authLogin,authLogout,handleTasks,handleFilterTasks} = Slice.actions;

const Reducer = Slice.reducer;

export {
    authLogin,
    authLogout,
    handleTasks,
    Reducer,
    handleFilterTasks
}