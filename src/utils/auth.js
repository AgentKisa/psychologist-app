"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { app } from "./firebase";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  let authInstance = null;
  if (app) {
    authInstance = getAuth(app);
  }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Получаем инстанс auth
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      // Используем authInstance
      setUser(user);
      setLoading(false);

      // Проверка авторизации на стороне клиента (для редиректа)
      if (!user && router.pathname === "/psychologists") {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [authInstance, router]); // authInstance в зависимости

  const register = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password,
      ); // Используем authInstance
      console.log("Успешная регистрация:", result);
      return result;
    } catch (error) {
      console.error("Ошибка в register:", error);
      throw error;
    }
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(authInstance, email, password); // Используем authInstance
  };

  const logout = async () => {
    try {
      await signOut(authInstance); // Используем authInstance
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = { user, loading, register, login, logout, auth: authInstance }; // Передаем authInstance в контекст
  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
