import firebase from "firebase";

// Initialize Firebase

// config for demo site, replace with it your own config and data in expected structure if needed, see readme
const config = {
  apiKey: "AIzaSyC-aPQ7aEhdbE29jOa9jelRISrsdSByfHU",
  authDomain: "data-table-vue.firebaseapp.com",
  databaseURL: "https://data-table-vue.firebaseio.com",
  projectId: "data-table-vue",
  storageBucket: "data-table-vue.appspot.com",
  messagingSenderId: "1079528810421"
};

firebase.initializeApp(config);
