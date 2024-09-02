// src/api/axiosConfig.js

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASEURL}/api/`,
    timeout: 10000, // Set a timeout limit for requests (in milliseconds)
    headers: {
        'Content-Type': 'application/json',
        // Add any other custom headers here
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Modify response data or return it directly
        return response;
    },
    (error) => {
        // Handle response error (e.g., redirect on 401 Unauthorized)
        console.error(error, 'errorData')
        if (error.response && error.response.status === 401) {
            // Handle 401 error (e.g., redirect to login)
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
