import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyClt8aVCOPc-vxMdJ-LAJxY5C7kTieVteM",
  authDomain: "projectawstlApt.firebaseapp.com",
  projectId: "projectawstlApt",
  storageBucket: "projectawstlApt.firebasestorage.app",
  messagingSenderId: "710136480889",
  appId: "1:710136480889:web:89ed8283280a70a9f900a8",
  measurementId: "G-8JJ5HSZM8E"
};

const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
