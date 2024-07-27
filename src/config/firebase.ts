// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKdya6yohRZaHrJZ3RkdkCvLwBeHIjkRE",
  authDomain: "signalist-ec59d.firebaseapp.com",
  databaseURL: "https://signalist-ec59d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "signalist-ec59d",
  storageBucket: "signalist-ec59d.appspot.com",
  messagingSenderId: "645256731364",
  appId: "1:645256731364:web:d5f1f95a74a7d29eebaaf1"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
