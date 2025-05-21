// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAvgs00KmqT9LplLQIgsRxUgO6r_-cyMPw",
    authDomain: "inventorymanagement-64902.firebaseapp.com",
    projectId: "inventorymanagement-64902",
    storageBucket: "inventorymanagement-64902.firebasestorage.app",
    messagingSenderId: "468647258450",
    appId: "1:468647258450:web:aa14649ebb5fb12e00b28b",
    measurementId: "G-2KQY0NM0QK"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, sendPasswordResetEmail };