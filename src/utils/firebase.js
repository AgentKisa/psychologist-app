import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAmQzAqtepITWuYL_nwU9sQpzI8O9-LkOM",
  authDomain: "psychologist-app-e21ac.firebaseapp.com",
  projectId: "psychologist-app-e21ac",
  storageBucket: "psychologist-app-e21ac.firebasestorage.app",
  messagingSenderId: "349595474293",
  appId: "1:349595474293:web:cc18646f3e97e0812bdb3c",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getDatabase(
  app,
  "https://psychologist-app-e21ac-default-rtdb.europe-west1.firebasedatabase.app",
);

export { app, db };
