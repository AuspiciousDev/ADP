// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5v5Eupfv2jFQzyqDfJZrIjeaKDqloIFM",
  authDomain: "studentportal-20a8a.firebaseapp.com",
  projectId: "studentportal-20a8a",
  storageBucket: "studentportal-20a8a.appspot.com",
  messagingSenderId: "1009356162125",
  appId: "1:1009356162125:web:5ea9bfed57776704e24804",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
