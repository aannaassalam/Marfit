import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyCz4kdeFlHjhmsuZUo7O_X3ZtcSvMbiuGM",
  authDomain: "marfit-ecommerce.firebaseapp.com",
  projectId: "marfit-ecommerce",
  storageBucket: "marfit-ecommerce.appspot.com",
  messagingSenderId: "23837773340",
  appId: "1:23837773340:web:19c46737b7498756a399d9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider(); //enable google-signin pop-up
provider.setCustomParameters({ promt: "selected_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export default firebase;
