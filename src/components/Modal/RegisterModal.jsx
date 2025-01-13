"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../utils/auth";
import ReactModal from "react-modal";
import { updateProfile } from "firebase/auth";
import styles from "./RegisterModal.module.css";
import { useState, useEffect } from "react";

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
  name: yup.string().required("Please enter your name"),
});

const RegisterModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: firebaseRegister, loading, auth } = useAuth();
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  useEffect(() => {
    ReactModal.setAppElement("body");
  }, []);

  const onSubmit = async (data) => {
    try {
      const userCredential = await firebaseRegister(data.email, data.password);

      if (!userCredential || !userCredential.user) {
        throw new Error("Registration failed.");
      }

      if (auth && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.name });
        onClose();
        reset();
      } else {
        console.error("auth or auth.currentUser is null or undefined");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      let errorMessage = "An error occurred during registration.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The password is too weak.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (
        error.message === "Registration failed. userCredential or user is null."
      ) {
        errorMessage = "Registration failed. Please try again later.";
      }
      alert(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="32" height="32">
            <use href="/sprite.svg#icon-x"></use>
          </svg>
        </button>
        <h2 className={styles.modalTitle}>Registration</h2>
        <p className={styles.modalDescription}>
          Thank you for your interest in our platform! In order to register, we
          need some information. Please provide us with the following
          information.
        </p>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              {...registerForm("name")}
              type="text"
              placeholder="Name"
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <input
              {...registerForm("email")}
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
              {...registerForm("password")}
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
            Sign Up
          </button>
        </form>
      </div>
    </ReactModal>
  );
};

export default RegisterModal;
