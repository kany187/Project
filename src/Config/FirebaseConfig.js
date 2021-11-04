import  firebase from 'firebase/app';
import   'firebase/storage';
import  "firebase/auth";
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCh1Rz52hm3sz5ezthLFDqR2Y3biv10m3g",
  authDomain: "saylanihomepage-d06bf.firebaseapp.com",
  databaseURL: "https://saylanihomepage-d06bf.firebaseio.com",
  projectId: "saylanihomepage-d06bf",
  storageBucket: "saylanihomepage-d06bf.appspot.com",
  messagingSenderId: "717246813411",
  appId: "1:717246813411:web:06e6bcaf43a7732e9ce1d6",
  measurementId: "G-K7GVBZWW4B"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)

  export default firebase 
