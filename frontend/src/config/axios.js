import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/", //import.meta.env.BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

console.log(import.meta.env.VITE_API_URL);

export default axiosInstance;   