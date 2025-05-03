import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
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
            get().connectSocket();
        } catch (error) {
            console.log("Some error occured in checkAuth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    saveUserToStore: (userData) => {
        set({ authUser: userData });
        get().connectSocket();
    },

    logoutUser: () => {
        set({ authUser: null });
        get().disconnectSocket();
    },

    connectSocket: () => {
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