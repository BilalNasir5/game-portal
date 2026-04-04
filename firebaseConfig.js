import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSwNjh_-WM3ZnMpaBTuLtOz4hZaS1yOYs",
  authDomain: "gameportal-9084b.firebaseapp.com",
  projectId: "gameportal-9084b",
  storageBucket: "gameportal-9084b.firebasestorage.app",
  messagingSenderId: "446692676328",
  appId: "G-0G3GGXTRM0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { getDoc, setDoc, doc, signInWithPopup };
