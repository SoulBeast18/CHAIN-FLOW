import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcQr-qU98Qslg7IsFon7oYaOCeGU7tPlk",
  authDomain: "chain-flow-64d36.firebaseapp.com",
  projectId: "chain-flow-64d36",
  storageBucket: "chain-flow-64d36.appspot.com",
  messagingSenderId: "365317130589",
  appId: "1:365317130589:web:88f011ba5b782fe9cf00b4",
  measurementId: "G-BC7E470RGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };