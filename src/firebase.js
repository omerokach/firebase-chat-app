import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDDyhWD0EZ120kS1HENtmYrQg17uP3bQ3c",
    authDomain: "chat-app-252a1.firebaseapp.com",
    databaseURL: "https://chat-app-252a1-default-rtdb.firebaseio.com",
    projectId: "chat-app-252a1",
    storageBucket: "chat-app-252a1.appspot.com",
    messagingSenderId: "83311096437",
    appId: "1:83311096437:web:bd9d0759ec53290a83be3c",
    measurementId: "G-BS0BST6QMZ"
  };

  const app = firebase.initializeApp(firebaseConfig)

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID,
// });


export const auth = app.auth();
export default app;
