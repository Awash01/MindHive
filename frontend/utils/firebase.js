// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mindhive-1dae4.firebaseapp.com",
  projectId: "mindhive-1dae4",
  storageBucket: "mindhive-1dae4.firebasestorage.app",
  messagingSenderId: "346844582855",
  appId: "1:346844582855:web:332b32af0e3d186b1affe2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();