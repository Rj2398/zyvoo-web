import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { firebaseConfigureData } from "../../../config/Constant";

// 1. Map your configuration keys securely
const firebaseConfig = {
  apiKey: firebaseConfigureData?.FIREBASE_PUBLIC_API_KEY,
  authDomain: firebaseConfigureData?.FIREBASE_PUBLIC_AUTH_DOMAIN,
  projectId: firebaseConfigureData?.FIREBASE_PUBLIC_PROJECT_ID,
  storageBucket: firebaseConfigureData?.FIREBASE_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: firebaseConfigureData?.FIREBASE_PUBLIC_MESSAGING_SENDER_ID,
  appId: firebaseConfigureData?.FIREBASE_PUBLIC_APP_ID,
  measurementId: firebaseConfigureData?.FIREBASE_MEASUREMENT_ID,
};

// 2. Initialize the core app and auth instances
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 3. Setup standard providers
const provider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

// 4. Setup Apple OAuth Provider (Firebase handles the scopes internally)
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

// Export everything clean and ready for your components
export {
  auth,
  provider,
  fbProvider,
  appleProvider,
  signInWithPopup,
  OAuthProvider,
};

// import { initializeApp } from "firebase/app";
// import {getAuth,GoogleAuthProvider,signInWithPopup,OAuthProvider ,FacebookAuthProvider} from "firebase/auth";
// import {firebaseConfigureData,appleConfiguration,} from "../../../config/Constant";

// const firebaseConfig = {
//   apiKey: firebaseConfigureData?.FIREBASE_PUBLIC_API_KEY,
//   authDomain: firebaseConfigureData?.FIREBASE_PUBLIC_AUTH_DOMAIN,
//   projectId: firebaseConfigureData?.FIREBASE_PUBLIC_PROJECT_ID,
//   storageBucket: firebaseConfigureData?.FIREBASE_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: firebaseConfigureData?.FIREBASE_PUBLIC_MESSAGING_SENDER_ID,
//   appId: firebaseConfigureData?.FIREBASE_PUBLIC_APP_ID,
//   measurementId: firebaseConfigureData?.FIREBASE_MEASUREMENT_ID,
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// const fbProvider=new FacebookAuthProvider()
// const appleProvider = new OAuthProvider("apple.com");

// export const initializeAppleSignInScript = () => {
//   const scriptId = "apple-auth-script";
//   if (!document.getElementById(scriptId)) {
//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src =
//       "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
//     script.onload = initializeAppleSignIn;
//     document.body.appendChild(script);
//   }
// };

// const initializeAppleSignIn = () => {
//   if (window.AppleID) {
//     window.AppleID.auth.init({
//       clientId: appleConfiguration?.APPLE_CLIENT_ID,
//       scope: "email name",
//       redirectURI: appleConfiguration?.APPLE_REDIRECT_URL,
//       usePopup: true,
//     });
//   }
// };

// export { auth, provider, appleProvider, signInWithPopup, OAuthProvider ,fbProvider};
