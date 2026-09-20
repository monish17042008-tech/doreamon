import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration with active Realtime Database URL
export const firebaseConfig = {
  apiKey: "AIzaSyDfpGce9G3qGyMyyDERv90X5HJ4-OrMBtU",
  authDomain: "doreamon-web.firebaseapp.com",
  databaseURL: "https://doreamon-web-default-rtdb.firebaseio.com",
  projectId: "doreamon-web",
  storageBucket: "doreamon-web.firebasestorage.app",
  messagingSenderId: "1043071856508",
  appId: "1:1043071856508:web:e9b912cf253774d977fef9",
  measurementId: "G-Z7M0W0VVV0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
export const rtdb = getDatabase(app);

// Initialize Cloud Firestore Database (if activated)
export const db = getFirestore(app);

// Initialize Analytics safely
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics notice:", err);
    });
}
