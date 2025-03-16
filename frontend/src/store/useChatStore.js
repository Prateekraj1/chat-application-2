import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from './useAuthStore'

export const useChatStore = create((set , get)=>({
    messages : [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    //end point for fetching all the users
    getUsers: async () =>{
        try {
            set({isUserLoading: true});
            const res = await axiosInstance.get("/auth/fetchUsers");
            set({users: res.data});
        } catch (error) {
            console.log("Some error occured in the getUsers function in the useChatStore"+ error.message)
            toast.error(error.response.data.message)
        } finally{
            set({isUserLoading: false})
        }
    },

    //end point for fetching all the messages
    getMessages: async (userId) =>{
        try {
            set({isMessageLoading: true})
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isMessageLoading: false})
        }
    },

    sendMessage: async(dataMessage) => {
        const {messages , selectedUser} = get();
        try {
            const res = await axiosInstance.post(`/message/send${selectedUser._id}` , dataMessage);
            set({messages : [...messages , res.data]});
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    listenToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage" , (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;


            set({
                messages : [...get().messages , newMessage],
            })
        })
    },

    unlistenToMessage: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}))