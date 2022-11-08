// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZSwSeQ-Q383RBZy5E7u4nD52boylv40E",
  authDomain: "tinder-clone-new-365905.firebaseapp.com",
  projectId: "tinder-clone-new-365905",
  storageBucket: "tinder-clone-new-365905.appspot.com",
  messagingSenderId: "1083893074586",
  appId: "1:1083893074586:web:b368556b58d629dfd02d23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth, db};