import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isLogingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    //when the user is logged or signed in , fetch the userdata and make the isCheckingAuth false , for making loader and not showing home
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');

            set({ authUser: res.data });
            get().connetSocket();
        } catch (error) {
            console.log("Some error occured in checkAuth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    saveUserToStore: async (userData) => {
        set({ authUser: userData });
        get().connectSocket();
    },

    login: async (data) => {
        set({ isLogingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connetSocket();
        } catch (error) {
            // console.log("Some error occured in the login function in useAuthStore" + error.message);
            toast.error(error.response.data.message);
        } finally {
            set({ isLogingIn: false });
        }
    },

    updateProfile: async (data) => {
        try {
            set({ isUpdatingProfile: true });
            const res = await axiosInstance.put("/auth/updateProfile", data);
            set({ authUser: res.data });
            toast.success("Profile uploaded successfully");
        } catch (error) {
            console.log("Error in uplaoding the profile image " + error.message);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    connetSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }

}))