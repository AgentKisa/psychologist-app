import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Для Realtime Database
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAmQzAqtepITWuYL_nwU9sQpzI8O9-LkOM",
  authDomain: "psychologist-app-e21ac.firebaseapp.com",
  projectId: "psychologist-app-e21ac",
  storageBucket: "psychologist-app-e21ac.firebasestorage.app",
  messagingSenderId: "349595474293",
  appId: "1:349595474293:web:cc18646f3e97e0812bdb3c",
};

let app;

// Проверяем, запущено ли приложение на клиенте
if (typeof window !== "undefined") {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]; // Если уже инициализировано, используем существующее
  }
}

const db =
  typeof window !== "undefined"
    ? getDatabase(
        app,
        "https://psychologist-app-e21ac-default-rtdb.europe-west1.firebasedatabase.app",
      )
    : null;

export { app, db };
