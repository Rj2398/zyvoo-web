import axios from "axios";
import { KEYS, baseURL } from "../config/Constant";
import store from "../store";
import { LogoutError } from "../config/Constant"; // 💡 IMPORT YOUR LOGOUT UTILITY HERE (Adjust path if needed)

// Setup Timezone
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const normalizedTimezone =
  timezone === "Asia/Calcutta" ? "Asia/Kolkata" : timezone;

// --- 1. AXIOS INSTANCES CREATION ---

const guestApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Timezone: normalizedTimezone,
  },
});

const formDataApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
    Timezone: normalizedTimezone,
  },
});

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Timezone: normalizedTimezone,
  },
});

// --- 2. REQUEST INTERCEPTORS ---

const getAuthToken = () => {
  const { userInfo } = store.getState().user;
  let token = userInfo?.token;

  const storedUserString =
    localStorage.getItem(KEYS.USER_INFO) ||
    sessionStorage.getItem(KEYS.USER_INFO);

  if (storedUserString) {
    try {
      const parsedUser = JSON.parse(storedUserString);
      token = parsedUser?.access_token || token;
    } catch (parseError) {
      console.error("Error parsing stored user info:", parseError);
    }
  }
  return token;
};

guestApi.interceptors.request.use(
  async (config) => {
    try {
      const token = getAuthToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("No token found, guestApi request might be unauthorized.");
      }
      return config;
    } catch (error) {
      console.error("Error in guestApi request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error),
);

formDataApi.interceptors.request.use(
  async (config) => {
    try {
      const token = getAuthToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error in formDataApi request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error),
);

api.interceptors.request.use(
  async (config) => {
    try {
      const token = getAuthToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error in api request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error),
);

// --- 3. GLOBAL RESPONSE INTERCEPTORS ---

/**
 * Handles successful HTTP responses (Status code 2xx).
 */
const handleResponseSuccess = (response) => {
  if (!response) {
    return Promise.reject(
      new Error("Server not responding. Please try again."),
    );
  }

  const resData = response.data;

  if (resData && resData.success === false) {
    // 💡 OPTIONAL SAFETYSWITCH: If backend returns 200 OK but says Unauthenticated
    if (resData.message === "Unauthenticated.") {
      LogoutError(resData.message);
      return new Promise(() => {}); // Halts code execution down the line
    }
    return Promise.reject(resData);
  }

  return response;
};

/**
 * Handles explicit HTTP error responses (Status codes 4xx, 5xx, network failures).
 */
const handleResponseError = (err) => {
  const errorResponse = err?.response?.data;
  const statusCode = err?.response?.status;

  // 💡 GLOBAL AUTH CHECKER: Intercepts 401s or Unauthenticated payloads across all 3 APIs
  if (statusCode === 401 || errorResponse?.message === "Unauthenticated.") {
    LogoutError(errorResponse?.message);

    /* CRITICAL: Return a permanently pending promise. 
      This cleanly stops the error from leaking into your component's useMutation catch block, 
      effectively silencing the second toast!
    */
    return new Promise(() => {});
  }

  return Promise.reject(errorResponse || err);
};

// Bind interceptors globally to all created instances
[api, guestApi, formDataApi].forEach((instance) => {
  instance.interceptors.response.use(
    handleResponseSuccess,
    handleResponseError,
  );
});

export { api, guestApi, formDataApi };

// import axios from "axios";
// import { KEYS, baseURL } from "../config/Constant";
// import store from "../store";

// // Setup Timezone
// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const normalizedTimezone =
//   timezone === "Asia/Calcutta" ? "Asia/Kolkata" : timezone;

// // --- 1. AXIOS INSTANCES CREATION ---

// const guestApi = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "application/json",
//     Timezone: normalizedTimezone,
//   },
// });

// const formDataApi = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "multipart/form-data",
//     Timezone: normalizedTimezone,
//   },
// });

// const api = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "application/json",
//     Timezone: normalizedTimezone,
//   },
// });

// // --- 2. REQUEST INTERCEPTORS ---

// // Helper function to extract token safely
// const getAuthToken = () => {
//   const { userInfo } = store.getState().user;
//   let token = userInfo?.token;

//   const storedUserString =
//     localStorage.getItem(KEYS.USER_INFO) ||
//     sessionStorage.getItem(KEYS.USER_INFO);

//   if (storedUserString) {
//     try {
//       const parsedUser = JSON.parse(storedUserString);
//       token = parsedUser?.access_token || token;
//     } catch (parseError) {
//       console.error("Error parsing stored user info:", parseError);
//     }
//   }
//   return token;
// };

// // Request interceptor for guestApi
// guestApi.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = getAuthToken();
//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       } else {
//         console.warn("No token found, guestApi request might be unauthorized.");
//       }
//       return config;
//     } catch (error) {
//       console.error("Error in guestApi request interceptor:", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => Promise.reject(error)
// );

// // Request interceptor for formDataApi
// formDataApi.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = getAuthToken();
//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       console.error("Error in formDataApi request interceptor:", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => Promise.reject(error)
// );

// // Request interceptor for api
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = getAuthToken();
//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       console.error("Error in api request interceptor:", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => Promise.reject(error)
// );

// // --- 3. GLOBAL RESPONSE INTERCEPTORS ---

// /**
//  * Handles successful HTTP responses (Status code 2xx).
//  * Converts API payloads with status 200 but "success": false into actual Promise rejections.
//  */
// const handleResponseSuccess = (response) => {
//   if (!response) {
//     return Promise.reject(
//       new Error("Server not responding. Please try again.")
//     );
//   }

//   const resData = response.data;

//   // CATCHES: Status 200 but payload signals business logic validation failure
//   if (resData && resData.success === false) {
//     // Rejects the promise so your component/page can catch 'resData' and show its own toast
//     return Promise.reject(resData);
//   }

//   return response;
// };

// /**
//  * Handles explicit HTTP error responses (Status codes 4xx, 5xx, network failures).
//  */
// const handleResponseError = (err) => {
//   const errorResponse = err?.response?.data;
//   return Promise.reject(errorResponse || err);
// };

// // Bind interceptors globally to all created instances
// [api, guestApi, formDataApi].forEach((instance) => {
//   instance.interceptors.response.use(
//     handleResponseSuccess,
//     handleResponseError
//   );
// });

// export { api, guestApi, formDataApi };

// import axios from "axios";
// import { KEYS, baseURL } from "../config/Constant";
// import store from "../store";
// import { toast } from "react-toastify"; // Ensure this matches your project's toast library

// // Setup Timezone
// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const normalizedTimezone = timezone === "Asia/Calcutta" ? "Asia/Kolkata" : timezone;

// // --- 1. AXIOS INSTANCES CREATION ---

// const guestApi = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "application/json",
//     Timezone: normalizedTimezone,
//   },
// });

// const formDataApi = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "multipart/form-data",
//     Timezone: normalizedTimezone,
//   },
// });

// const api = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "application/json",
//     Timezone: normalizedTimezone,
//   },
// });

// // --- 2. REQUEST INTERCEPTORS ---

// // Helper function to extract token safely
// const getAuthToken = () => {
//   const { userInfo } = store.getState().user;
//   let token = userInfo?.token;

//   const storedUserString =
//     localStorage.getItem(KEYS.USER_INFO) ||
//     sessionStorage.getItem(KEYS.USER_INFO);

//   if (storedUserString) {
//     try {
//       const parsedUser = JSON.parse(storedUserString);
//       token = parsedUser?.access_token || token;
//     } catch (parseError) {
//       console.error("Error parsing stored user info:", parseError);
//     }
//   }
//   return token;
// };

// // Request interceptor for guestApi
// guestApi.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = getAuthToken();
//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       } else {
//         console.warn("No token found, guestApi request might be unauthorized.");
//       }
//       return config;
//     } catch (error) {
//       console.error("Error in guestApi request interceptor:", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => Promise.reject(error)
// );

// // Request interceptor for formDataApi
// formDataApi.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = getAuthToken();
//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       console.error("Error in formDataApi request interceptor:", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => Promise.reject(error)
// );

// // Request interceptor for api
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = getAuthToken();
//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       console.error("Error in api request interceptor:", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => Promise.reject(error)
// );

// // --- 3. GLOBAL RESPONSE INTERCEPTORS ---

// /**
//  * Handles successful HTTP responses (Status code 2xx).
//  * Essential for your case because the API returns a status 200 code
//  * but includes "success": false in the payload.
//  */
// const handleResponseSuccess = (response) => {
//   if (!response) {
//     const fallbackError = "Server not responding. Please try again.";
//     toast.error(fallbackError);
//     return Promise.reject(new Error(fallbackError));
//   }

//   const resData = response.data;

//   // CATCHES: Status 200 but payload signals business logic validation failure
//   if (resData && resData.success === false) {
//     const errorMessage = resData.message || "Booking verification failed.";
//     toast.error(errorMessage); // Shows your toast containing the host's hours restrictions

//     return Promise.reject(resData); // Forwards payload failure so the UI catch block catches it
//   }

//   return response;
// };

// /**
//  * Handles explicit HTTP error responses (Status codes 4xx, 5xx, network failures).
//  */
// const handleResponseError = (err) => {
//   const errorResponse = err?.response?.data;
//   const errorMessage = errorResponse?.message || "Something went wrong. Please try again.";

//   toast.error(errorMessage);
//   return Promise.reject(errorResponse || err);
// };

// // Bind interceptors globally to all created instances
// [api, guestApi, formDataApi].forEach((instance) => {
//   instance.interceptors.response.use(handleResponseSuccess, handleResponseError);
// });

// export { api, guestApi, formDataApi };

// import axios from "axios";
// import { KEYS, baseURL } from "../config/Constant";
// import store from "../store";

// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const normalizedTimezone =
//   timezone == "Asia/Calcutta" ? "Asia/Kolkata" : timezone;

// const guestApi = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "application/json",
//     Timezone: normalizedTimezone,
//   },
// });

// const formDataApi = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "multipart/form-data",
//     Timezone: normalizedTimezone,
//   },
// });

// const api = axios.create({
//   baseURL: baseURL,
//   headers: {
//     "Content-Type": "application/json",
//     Timezone: normalizedTimezone,
//   },
// });

// guestApi.interceptors.request.use(
//   async (config) => {
//     try {
//       const { userInfo } = store.getState().user;
//       let token = userInfo?.token;

//       const storedUserString =
//         localStorage.getItem(KEYS.USER_INFO) ||
//         sessionStorage.getItem(KEYS.USER_INFO);

//       if (storedUserString) {
//         try {
//           const parsedUser = JSON.parse(storedUserString);
//           token = parsedUser?.access_token || token;
//         } catch (parseError) {
//           console.error("Error parsing localStorage token:", parseError);
//         }
//       }

//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       } else {
//         console.warn("No token found, API request might be unauthorized.");
//       }

//       return config;
//     } catch (error) {
//       console.error("Error in interceptor", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Request interceptor for formDataApi
// formDataApi.interceptors.request.use(
//   async (config) => {
//     try {
//       const { userInfo } = store.getState().user;
//       let token = userInfo?.token;

//       const storedUserString =
//         JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
//         JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
//       token = storedUserString?.access_token || token;

//       if (token) {
//         config.headers["Authorization"] = token ? `Bearer ${token}` : "";
//       }

//       return config;
//     } catch (error) {
//       console.error("Error in interceptor", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => {
//     return Promise.reject(error); // Handle request errors
//   }
// );

// // Request interceptor for api
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       return config;
//     } catch (error) {
//       console.error("Error in api request interceptor:", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for api
// api.interceptors.response.use(
//   (response) => {
//     if (response) {
//       return response;
//     } else {
//       return Promise.reject(
//         new Error("Server not responding. Please try again.")
//       );
//     }
//   },
//   (err) => {
//     const errorResponse = err?.response?.data;

//     return Promise.reject(errorResponse);
//   }
// );

// export { api, guestApi, formDataApi };
