import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL : 'https://chat-application-2-1.onrender.com/api',
    withCredentials: true,
})