import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5MQflClZu-DsMVHKRj1HiP-LUKmIkVoY",
  authDomain: "spy-sniffer.firebaseapp.com",
  projectId: "spy-sniffer",
  storageBucket: "spy-sniffer.firebasestorage.app",
  messagingSenderId: "997023883252",
  appId: "1:997023883252:web:56ee0ce46730e72609e3a1",
  measurementId: "G-B971W5EHMS",
  // Add the database URL if you have one
  databaseURL: "https://spy-sniffer-default-rtdb.firebaseio.com",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const firestore = getFirestore(app)

export { app, auth, firestore }
