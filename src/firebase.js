import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAr72OFdHeQwrrfeWWp1DhgVz4ZFcmoDjY",

  authDomain: "projectawstlapt.firebaseapp.com",

  projectId: "projectawstlapt",

  storageBucket: "projectawstlapt.firebasestorage.app",

  messagingSenderId: "1051010128303",

  appId: "1:1051010128303:web:cb77b471d9228538d6775a",

  measurementId: "G-L1MGMSNP83"

};



const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
