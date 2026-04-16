// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

// Actual Firebase configuration from user
const firebaseConfig = {
  apiKey: "AIzaSyAVjGRh7Uu3UpHHp2iEj_ZPPY0i_TFH7y4",
  authDomain: "drury-188-189.firebaseapp.com",
  projectId: "drury-188-189",
  storageBucket: "drury-188-189.firebasestorage.app",
  messagingSenderId: "254953140067",
  appId: "1:254953140067:web:f3905761218b25fdb1ed56",
  measurementId: "G-KX7WP991X8"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics (Browser-only)
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { db, analytics };


