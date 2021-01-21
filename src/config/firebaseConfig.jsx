import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
	apiKey: "AIzaSyBOnGgUPMWIXsoz08YsNguaTlSMxaZfsyc",
	authDomain: "marfit-ea7ba.firebaseapp.com",
	projectId: "marfit-ea7ba",
	storageBucket: "marfit-ea7ba.appspot.com",
	messagingSenderId: "337381636339",
	appId: "1:337381636339:web:162c20d4a81bea8074df86",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider(); //enable google-signin pop-up
provider.setCustomParameters({ promt: "selected_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export default firebase;
