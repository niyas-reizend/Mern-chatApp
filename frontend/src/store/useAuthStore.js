import {create} from "zustand";
import axiosInstance from "../lib/axios.js";
import {toast} from "react-hot-toast";

export const useAuthStore = create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLogginIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    // to check the user is logged in 
    checkAuth:async()=>{
        try{
            const res = await axiosInstance.get("/auth/checkAuth");
            const testres =res.data
            // console.log("response from backend " ,!testres)
            set({authUser:res.data});

        }catch(error){
            console.log("Error in checkAuth:",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false})
        }
    },
        // for user signup 
    signup:async(data)=>{
        set({isSigningUp:true})
        try{
           const res = await axiosInstance .post ("/auth/signup",data);
           set({authUser:res.data});
           toast.success("Account created Successfully");
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false});
        }
    },
    // login for users 
    login:async(data)=>{
        set({isLogginIn:true});
        try{
            const res = await axiosInstance.post("/auth/login",data);
            console.log(res.data);
                        
            set({authUser:res.data});
            toast.success("Logged in Successfully")
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isLogginIn:false})
        }
    },
    // logout for users 
    logout:async() =>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");            
        }catch(error){
            toast.error(error.response.data.message)
        }
    },
    // update user profile 
    updateProfile:async(data) => {
        
    }

}))