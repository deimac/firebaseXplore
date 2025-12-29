// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For more information on how to get this object, see:
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyD8Jb7Y-7VeYO47kVCQUta4R6265AKf5HA",
  authDomain: "xplore-viagens.firebaseapp.com",
  projectId: "xplore-viagens",
  storageBucket: "xplore-viagens.firebasestorage.app",
  messagingSenderId: "232742205208",
  appId: "1:232742205208:web:601e8aaad653389aa5d06d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
