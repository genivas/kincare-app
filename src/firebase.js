import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCy9viHxSRZg7eUfiEeO_t5BQ3H7o4ivNw",
  authDomain: "kincare-818c5.firebaseapp.com",
  projectId: "kincare-818c5",
  storageBucket: "kincare-818c5.firebasestorage.app",
  messagingSenderId: "205397452787",
  appId: "1:205397452787:web:41fd527af761d2619dd486",
  measurementId: "G-CE15XFGS4C"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
