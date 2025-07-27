import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA50FyYGy8AErc9_tjdqbdKYnN-gso6Z7Q",
  authDomain: "rcnoidacentral-31cc8.firebaseapp.com",
  projectId: "rcnoidacentral-31cc8",
  storageBucket: "rcnoidacentral-31cc8.firebasestorage.app",
  messagingSenderId: "516120728295",
  appId: "1:516120728295:web:101afd379a0fb944efc842",
  measurementId: "G-766RBLPGFQ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
