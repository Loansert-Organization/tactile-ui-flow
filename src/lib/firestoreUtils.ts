
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  Timestamp
} from "firebase/firestore";

/**
 * Add any Firestore collection helpers as needed, e.g. for sessions, qrCodes, etc.
 */

// Example: createSession
export async function createSession({ language }: { language?: string }) {
  const sessionsRef = collection(db, "sessions");
  const now = Timestamp.now();
  const docRef = await addDoc(sessionsRef, {
    createdAt: now,
    lastActivity: now,
    language: language || "en",
  });
  return docRef.id;
}

// Example: generic getter for a collection
export async function getCollectionDocs(coll: string) {
  const ref = collection(db, coll);
  const snap = await getDocs(ref);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add additional helpers as needed per schema...
