// firebase-config.js
// Central place to initialize Firebase. Every auth page imports { auth } from here
// so there's only one spot to paste your real project keys.
//
// Get these values from: Firebase Console > Project settings > General > Your apps > SDK setup and configuration
 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALdkHWF2iFVxOIkP9ISk-59ljiqbD7zWs",
  authDomain: "arcticmkt-35b28.firebaseapp.com",
  projectId: "arcticmkt-35b28",
  storageBucket: "arcticmkt-35b28.firebasestorage.app",
  messagingSenderId: "932609364114",
  appId: "1:932609364114:web:d6a930de9ac59cb8dcd64b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);