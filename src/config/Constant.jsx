import { toast } from "react-toastify";

// App Host Domain Base URLs
export const baseURL = "https://zyvo.tgastaging.com/api/";
export const imageBase = "https://zyvo.tgastaging.com/";

// Local Storage & State Keys Constants
export const KEYS = {
  USER_INFO: "USER_INFO",
  DEVICE_TOKEN: "DEVICE_TOKEN",
  USER_TYPE: "USER_TYPE",
  KEEP_LOGIN: "KEEP_LOGIN",
};

export const GOOGLE_KEY = "AIzaSyDcDl4RoLc2oLDDpkJqdhWOWHP0B4qBEqk";

// export const GOOGLE_KEY="AIzaSyAvdUxrhv49imo4xWac52D-E_PQvmHyqhs"

export const StripePublicKey =
  "pk_test_51OJYBTBtvbMCJV4HYgcTe7suuWdRm8p0YqsRVOT7VU8z1CmCeMwK1MSIYRp0NQRaBiH26gE3VgmENFKybIgNJVrd00UGnNavL3";

let selectedFlow = "guest";

// Verified Firebase Config Object
export const firebaseConfigureData = {
  FIREBASE_PUBLIC_API_KEY: "AIzaSyBserRdfbDQrDS4AeF8_8IVtT36e3D5_BU",
  FIREBASE_PUBLIC_AUTH_DOMAIN: "zyvo-1aea1.firebaseapp.com",
  FIREBASE_PUBLIC_PROJECT_ID: "zyvo-1aea1",
  FIREBASE_PUBLIC_STORAGE_BUCKET: "zyvo-1aea1.firebasestorage.app",
  FIREBASE_PUBLIC_MESSAGING_SENDER_ID: "81364080009",
  FIREBASE_PUBLIC_APP_ID: "1:81364080009:web:d1aef919932d4dc473bd58",
  FIREBASE_MEASUREMENT_ID: "G-BWFVKH06ZL",
};

// FIXED: Apple Redirect URL must point directly to your Firebase Auth redirect handler
export const appleConfiguration = {
  APPLE_CLIENT_ID: "com.zyvollc.web", // Your Apple Service ID
  APPLE_REDIRECT_URL: "https://zyvo-1aea1.firebaseapp.com/__/auth/handler",
};
let isLoggingOut = false;
// Cleaned Session Eviction Utility Flow
export const LogoutError = (errorMessage) => {
  console.log(errorMessage, "error message123");
  if (isLoggingOut) return;

  isLoggingOut = true;

  toast.error("Session expired. Please login again.");
  // 1. Instantly demote access privileges
  localStorage.setItem("USER_TYPE", "guest");

  // 2. Clear out identifying tokens completely immediately
  localStorage.removeItem("USER_INFO");
  sessionStorage.removeItem("USER_INFO");
  localStorage.removeItem("SocialLogin");

  // 4. Force state alignment after a micro-timeout
  setTimeout(() => {
    window.location.replace("/"); // Replaces the window history entry to prevent back-button loops
  }, 800);
};

export default {
  selectedFlow,
};

// import { toast } from "react-toastify";

// export const baseURL = "https://zyvo.tgastaging.com/api/";
// export const imageBase = "https://zyvo.tgastaging.com/";
// export const KEYS = {
//   USER_INFO: "USER_INFO",
//   DEVICE_TOKEN: "DEVICE_TOKEN",
//   USER_TYPE: "USER_TYPE",
//   KEEP_LOGIN: "KEEP_LOGIN",
//   // timezone:Intl.DateTimeFormat().resolvedOptions().timeZone
// };
// export const GOOGLE_KEY = "AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw";

// export const StripePublicKey =
//   "pk_test_51OJYBTBtvbMCJV4HYgcTe7suuWdRm8p0YqsRVOT7VU8z1CmCeMwK1MSIYRp0NQRaBiH26gE3VgmENFKybIgNJVrd00UGnNavL3";

// let selectedFlow = "guest";

// export const firebaseConfigureData = {
//   FIREBASE_PUBLIC_API_KEY: "AIzaSyBserRdfbDQrDS4AeF8_8IVtT36e3D5_BU",
//   FIREBASE_PUBLIC_AUTH_DOMAIN: "zyvo-1aea1.firebaseapp.com",
//   FIREBASE_PUBLIC_PROJECT_ID: "zyvo-1aea1",
//   FIREBASE_PUBLIC_STORAGE_BUCKET: "zyvo-1aea1.firebasestorage.app",
//   FIREBASE_PUBLIC_MESSAGING_SENDER_ID: "81364080009",
//   FIREBASE_PUBLIC_APP_ID: "1:81364080009:web:d1aef919932d4dc473bd58",
//   FIREBASE_MEASUREMENT_ID: "G-BWFVKH06ZL",
// };

// export const appleConfiguration = {
//   APPLE_CLIENT_ID: "com.zyvollc.web",
//   APPLE_REDIRECT_URL: "https://zyvo-4.vercel.app/",
// };

// export const LogoutError = () => {
//   // toast.error("Session Expired. Logout Successfully.");

//   localStorage.setItem("USER_TYPE", "guest");

//   setTimeout(() => {
//     const userInfo = localStorage.getItem("USER_INFO");

//     // If USER_INFO is null, undefined, or empty string
//     if (!userInfo) {
//       localStorage.removeItem("USER_INFO");
//       sessionStorage.removeItem("USER_INFO");
//       window.location.href = "/";
//     }
//   }, 1000);
// };

// export default {
//   selectedFlow,
// };
