import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBqo6wK7UBQKfjFeHeGsQO8mGg3DlL81Xg",
  authDomain: "sabe-8ade3.firebaseapp.com",
  projectId: "sabe-8ade3",
  storageBucket: "sabe-8ade3.firebasestorage.app",
  messagingSenderId: "825202847213",
  appId: "1:825202847213:web:418463cf9c65cb9d2dcbe4",
  measurementId: "G-GTVF12QXF1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);