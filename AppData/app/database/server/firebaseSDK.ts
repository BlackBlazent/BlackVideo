// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmTGev7woUE1kftEIePEr_wtFfr5RyI28",
  authDomain: "blackvideo-6b1b2.firebaseapp.com",
  projectId: "blackvideo-6b1b2",
  storageBucket: "blackvideo-6b1b2.firebasestorage.app",
  messagingSenderId: "818847615276",
  appId: "1:818847615276:web:06e2295aee8b9503b50489",
  measurementId: "G-P383ZSFR85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);