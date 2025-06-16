// firebase packages
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYKLzaJ1wKiIVYeOLPl64QolxRbdM5C80",
  authDomain: "chat-app-9f7c3.firebaseapp.com",
  projectId: "chat-app-9f7c3",
  storageBucket: "chat-app-9f7c3.firebasestorage.app",
  messagingSenderId: "181627216466",
  appId: "1:181627216466:web:8155c6cd71c874540a358b",
  measurementId: "G-DJGVYNN5Q0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
