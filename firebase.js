// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLOYH6eED-fiACssvxlN-RA2Tt8Z6jse8",
  authDomain: "pantry-627d7.firebaseapp.com",
  projectId: "pantry-627d7",
  storageBucket: "pantry-627d7.appspot.com",
  messagingSenderId: "142668039212",
  appId: "1:142668039212:web:072057711a65fe9b78fd89",
  measurementId: "G-8JF131E11N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export { firestore };