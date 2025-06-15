
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence
} from "firebase/firestore";

/** 
 * Firebase client config. (OK for public keys)
 * NOTE: For private keys/functions, Lovable recommends Supabase.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCi8mbUIHviolGC_vMg9UU5AtKqqfwhMTo",
  authDomain: "ikanisa-ac07c.firebaseapp.com",
  projectId: "ikanisa-ac07c",
  storageBucket: "ikanisa-ac07c.appspot.com",
  messagingSenderId: "884527325587",
  appId: "1:884527325587:web:63fa9b5076fbd27d6b0866",
  measurementId: "G-M4MNW51BW4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Firestore instance & persistence
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch(e => {
  // Persistence may fail in private mode or multiple tabs.
  if (process.env.NODE_ENV === "development") {
    // Optional: log only in dev
    console.warn("Firestore persistence not enabled:", e.message);
  }
});
