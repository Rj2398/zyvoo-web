// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBserRdfbDQrDS4AeF8_8IVtT36e3D5_BU",
  authDomain: "zyvo-1aea1.firebaseapp.com",
  projectId: "zyvo-1aea1",
  storageBucket: "zyvo-1aea1.firebasestorage.app",
  messagingSenderId: "81364080009",
  appId: "1:81364080009:web:d1aef919932d4dc473bd58",
  measurementId: "G-BWFVKH06ZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);