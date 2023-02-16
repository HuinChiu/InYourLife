// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpL3yfC44qD3sYWvfN2JfRKicwkQ3KKSA",
  authDomain: "inyourlife-716bb.firebaseapp.com",
  projectId: "inyourlife-716bb",
  storageBucket: "inyourlife-716bb.appspot.com",
  messagingSenderId: "404097127531",
  appId: "1:404097127531:web:ff1559ca352ea27a6f8d2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth()

export {auth};
