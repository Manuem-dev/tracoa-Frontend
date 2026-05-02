import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLhSo0ent_r07hy2PgwCFyE5D8oecjdnE",
  authDomain: "tracao-8ac9a.firebaseapp.com",
  projectId: "tracao-8ac9a",
  storageBucket: "tracao-8ac9a.firebasestorage.app",
  messagingSenderId: "917447867610",
  appId: "1:917447867610:web:099993d8bbf0220697b9e3",
  measurementId: "G-FR9VWLKGRP"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, analytics, auth };
