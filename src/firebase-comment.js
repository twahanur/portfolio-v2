import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

// const firebaseConfig = {
//     apiKey: "AIzaSyDJPq9a0YPoQYkpQ-Uaw7aXQRXzzqOKzFA",
//     authDomain: "web-kelas-tes.firebaseapp.com",
//     projectId: "web-kelas-tes",
//     storageBucket: "web-kelas-tes.appspot.com",
//     messagingSenderId: "890817433268",
//     appId: "1:890817433268:web:11e5258f8864a6174c11e1"
// };

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyB-lfUt1adpQ0KYcFFW_oAWTJVfHDOOZy8",
//     authDomain: "portofolio-web-3e8e8.firebaseapp.com",
//     projectId: "portofolio-web-3e8e8",
//     storageBucket: "portofolio-web-3e8e8.appspot.com",
//     messagingSenderId: "25195509306",
//     appId: "1:25195509306:web:2b635dcf997137bf612703"
//   };

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

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };