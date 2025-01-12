"use client";

import React, { useState } from "react";
import ReactModal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../utils/auth";
import { useEffect } from "react";
import styles from "./LoginModal.module.css";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.50)",
    zIndex: 10,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
    border: "none",
    padding: "0px",
    maxWidth: "90vw",
    zIndex: 11,
    background: "none",
  },
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const LoginModal = ({ isOpen, onRequestClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const appElement = document.getElementById("__next");
    if (appElement) {
      ReactModal.setAppElement("#__next");
    }
  }, []);

  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      console.log("Login successful!");
      onRequestClose();
    } catch (error) {
      console.error("Error during login:", error);
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      appElement={document.body}
      style={customStyles}
      shouldCloseOnOverlayClick={true}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onRequestClose}>
          <svg width="32" height="32">
            <use href="/sprite.svg#icon-x"></use>
          </svg>
        </button>
        <h2 className={styles.modalTitle}>Log In</h2>
        <p className={styles.modalDescription}>
          Welcome back! Please enter your credentials to access your account and
          continue your search for a psychologist.
        </p>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputWrapper}>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={styles.input}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
            />
            <svg
              width="20"
              height="20"
              onClick={togglePasswordVisibility}
              className={styles.eyeIcon}
            >
              <use
                href={
                  showPassword
                    ? "/sprite.svg#icon-eye"
                    : "/sprite.svg#icon-eye-off"
                }
              ></use>
            </svg>
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className={styles.submitButton}>
            Log In
          </button>
        </form>
      </div>
    </ReactModal>
  );
};

export default LoginModal;
