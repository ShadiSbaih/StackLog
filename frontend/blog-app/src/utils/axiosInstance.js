import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

//request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //handle common errors  globally
        if (error.response) {
            if (error.response.status === 401) {
                //redirect to login page if token is expired
                window.location.href = "/login";
            }
            else if(error.response.status===500){
                console.error("Server error, please try again later");
            }
            else if(error.code==="ECONNABORTED"){
                console.error("Request timeout, please try again later");
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;
