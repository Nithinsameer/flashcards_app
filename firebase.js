// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirebase } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNapVW5LN3lLnGg3RptYsHniB-9D3LJFg",
  authDomain: "flashcards-95e90.firebaseapp.com",
  projectId: "flashcards-95e90",
  storageBucket: "flashcards-95e90.appspot.com",
  messagingSenderId: "1013375808577",
  appId: "1:1013375808577:web:3114951477f30d0585c2c0",
  measurementId: "G-QCYZN9CCYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirebase(app)

export {db}