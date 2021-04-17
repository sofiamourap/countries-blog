import * as firebase from "firebase";
import { defaultTypeResolver } from "graphql";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyCk_00VrMmwXhC1sqs-kg4JU3DFw_hDEQ4",
  authDomain: "countriesblog-bf8b7.firebaseapp.com",
  projectId: "countriesblog-bf8b7",
  storageBucket: "countriesblog-bf8b7.appspot.com",
  // messagingSenderId: "524808616825",
  appId: "1:524808616825:web:ceed7d3a06cdcbfb02cda8",
  measurementId: "G-JN15PKN8RE",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;
export const googleAuthProvider = new firebase.auth.googleAuthProvider();
