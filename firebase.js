import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBWzqwQoVkDoU84Z35j_SwCx-F2X9T1Hn0",
  authDomain: "react-notes-5af83.firebaseapp.com",
  projectId: "react-notes-5af83",
  storageBucket: "react-notes-5af83.appspot.com",
  messagingSenderId: "677889851648",
  appId: "1:677889851648:web:c01f7e24ce049edd6733e5",
  measurementId: "G-7KQMNCCJ58"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")

// const analytics = getAnalytics(app);