// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBfhbjU5C_GdZVtyha_lvvPr2pv0DlvYts",
  authDomain: "date-planner-552e2.firebaseapp.com",
  projectId: "date-planner-552e2",
  storageBucket: "date-planner-552e2.firebasestorage.app",
  messagingSenderId: "134265460492",
  appId: "1:134265460492:web:2bad31c59db392c90d5b29",
  measurementId: "G-906TBPD9W7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);