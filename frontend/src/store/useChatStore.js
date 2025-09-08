import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import axios from "axios";


export const useChatStore = create((set,get) =>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading: false,
    isMessagesLoading:false,


    getUsers:async() =>{
        set({ isUserLoading:true});
        try{
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data.filterdUsers});
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false})
        }
    },

    getMessages:async(userId) =>{
        set({isMessagesLoading:true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set ({messages:res.data.messages});
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage: async(messageData) =>{
       const{selectedUser,messages} = get()
       try{
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
        
        set({messages:[...messages,res.data]})
       }catch(error){
        console.log(error);
        toast.error(error.response.data.message)
       }
    },

    setSelectedUser:async(selectedUser) => set({selectedUser})
}))