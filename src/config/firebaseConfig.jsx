import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyAZZBovr3E2y26HeI_YiY1nfSZBze5GcRU",
    authDomain: "hirepluto-c045a.firebaseapp.com",
    databaseURL: "https://hirepluto-c045a.firebaseio.com",
    projectId: "hirepluto-c045a",
    storageBucket: "hirepluto-c045a.appspot.com",
    messagingSenderId: "977586421372",
    appId: "1:977586421372:web:6df314fe8949bd7c6113f9",
    measurementId: "G-CL0DEPLQ8L"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider(); //enable google-signin pop-up
provider.setCustomParameters({ promt: "selected_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export default firebase;
