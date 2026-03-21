import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCA7lvx_vx2ziexoDUkpSg1U4bUTJAsY7I",
  authDomain: "sprout-45169.firebaseapp.com",
  projectId: "sprout-45169",
  storageBucket: "sprout-45169.firebasestorage.app",
  messagingSenderId: "361625677057",
  appId: "1:361625677057:web:073a67bfc7521aed7eff00",
  measurementId: "G-SDF9BV5VXW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); 
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();