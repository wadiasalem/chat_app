import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8_bGWkQ88guLqwv1TkTrqTFVLr-QVnms",
  authDomain: "tpmobile-7cc09.firebaseapp.com",
  projectId: "tpmobile-7cc09",
  storageBucket: "tpmobile-7cc09.appspot.com",
  messagingSenderId: "582041353972",
  appId: "1:582041353972:web:4988da45e65d050d5528a1"
};

const initFirebase = app.initializeApp(firebaseConfig);
export default initFirebase;