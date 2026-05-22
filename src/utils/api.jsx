import axios from "axios";
import { KEYS, baseURL } from "../config/Constant";
import store from "../store";

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const normalizedTimezone = timezone == "Asia/Calcutta" ? "Asia/Kolkata" : timezone;

const guestApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Timezone" : normalizedTimezone
  },
});

const formDataApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
        "Timezone" : normalizedTimezone
  },
});

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
        "Timezone" : normalizedTimezone
  },
});

guestApi.interceptors.request.use(
  async (config) => {
    try {
      const { userInfo } = store.getState().user;
      let token = userInfo?.token;

      const storedUserString = localStorage.getItem(KEYS.USER_INFO) || sessionStorage.getItem(KEYS.USER_INFO);

      if (storedUserString) {
        try {
          const parsedUser = JSON.parse(storedUserString);
          token = parsedUser?.access_token || token;
        } catch (parseError) {
          console.error("Error parsing localStorage token:", parseError);
        }
      }

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("No token found, API request might be unauthorized.");
      }

      return config;
    } catch (error) {
      console.error("Error in interceptor", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for formDataApi
formDataApi.interceptors.request.use(
  async (config) => {
    try {
      const { userInfo } = store.getState().user;
      let token = userInfo?.token;

      const storedUserString = JSON.parse(localStorage.getItem(KEYS.USER_INFO)) || JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
      token = storedUserString?.access_token || token;

      if (token) {
        config.headers["Authorization"] = token ? `Bearer ${token}` : "";
      } 

      return config;
    } catch (error) {
      console.error("Error in interceptor", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

// Request interceptor for api
api.interceptors.request.use(
  async (config) => {
    try {
      return config;
    } catch (error) {
      console.error("Error in api request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor for api
api.interceptors.response.use(
  (response) => {
    if (response) {
      return response;
    } else {
      return Promise.reject(
        new Error("Server not responding. Please try again.")
      );
    }
  },
  (err) => {
    
    const errorResponse = err?.response?.data

    return Promise.reject(errorResponse);
  }
);

export { api, guestApi, formDataApi };
