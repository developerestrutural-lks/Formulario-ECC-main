// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_nFoU7aWYvREX94d9etWyd_V1ZpHpO44",
  authDomain: "seg-formulario.firebaseapp.com",
  projectId: "seg-formulario",
  storageBucket: "seg-formulario.firebasestorage.app",
  messagingSenderId: "197729039503",
  appId: "1:197729039503:web:0c23029e4c02738baeacfa",
  measurementId: "G-LVJGJ1V2GT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth };
