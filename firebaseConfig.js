import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxJXhz0zK_Fg7SJyRfZUWQphJNti0Am8I",
  authDomain: "agri-hub-davao.firebaseapp.com",
  projectId: "agri-hub-davao",
  storageBucket: "agri-hub-davao.firebasestorage.app",
  messagingSenderId: "97876158327",
  appId: "1:97876158327:web:8da23d7635937aa9bca372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);