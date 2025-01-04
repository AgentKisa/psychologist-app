"use client";

import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, // Для отслеживания состояния аутентификации
} from "firebase/auth";
import { auth } from "./firebase";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Отписываемся от слушателя при размонтировании компонента
  }, []);

  const register = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("Успешная регистрация:", result); // <--- Добавлено
      return result; // Важно вернуть результат!
    } catch (error) {
      console.error("Ошибка в register:", error); // <--- Добавлено
      throw error; // Важно пробросить ошибку дальше!
    }
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return { user, loading, register, login, logout };
};

export default auth;
