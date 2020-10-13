import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqCcCvs2_O1-DCxkXNZaJ99-WLGuu4VFE",
  authDomain: "project-a0139.firebaseapp.com",
  databaseURL: "https://project-a0139.firebaseio.com",
  projectId: "project-a0139",
  storageBucket: "project-a0139.appspot.com",
  messagingSenderId: "138167120267",
  appId: "1:138167120267:web:e50d2243da92458a047f8e",
  measurementId: "G-JJ6QZPGSNM",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider(); //enable google-signin pop-up
provider.setCustomParameters({ promt: "selected_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export default firebase;
