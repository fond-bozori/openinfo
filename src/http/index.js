// src/services/httpService.js

import axios from 'axios'

// Create an instance of axios
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_URL,
  withCredentials: import.meta.env.VITE_COOKIE_CREDENTIALS,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor
http.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // For example, add authentication token
    // config.headers.Authorization = `Bearer ${token}`;
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error)
  },
)

export default http
