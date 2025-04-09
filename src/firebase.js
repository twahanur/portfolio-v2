import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc } from "@firebase/firestore"; // Perbarui ini



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTnWW_ckgD1Zy24KnFoNg7nm3Z7dVx5Ko",
  authDomain: "portfolio-v2-cc424.firebaseapp.com",
  projectId: "portfolio-v2-cc424",
  storageBucket: "portfolio-v2-cc424.firebasestorage.app",
  messagingSenderId: "851398230074",
  appId: "1:851398230074:web:55e9cf3de6a5e23f6f3503",
  measurementId: "G-G4LS7BKQK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };


