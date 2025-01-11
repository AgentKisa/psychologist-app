"use client";

import ReactModal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../utils/auth";
import { useEffect, useState } from "react";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const LoginModal = ({ isOpen, onRequestClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Login Modal"
      className="modal"
      overlayClassName="modal-overlay"
      closeTimeoutMS={200}
      appElement={document.body}
      //   appElement={document.getElementById("body")}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)", // Semi-transparent black background
        },
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          // transform: "translate(-50%, -50%)",
          width: "400px", // Adjust width as needed
          border: "1px solid #ccc",
          background: "#fff",
          padding: "20px",
          borderRadius: "4px",
        },
      }}
    >
      <div className="modal-content">
        <button onClick={onRequestClose}>X</button>
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("email")} type="email" placeholder="Email" />{" "}
          {/* <--- Использование register */}
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
          />{" "}
          {/* <--- Использование register */}
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
          <button type="submit">Login</button>
        </form>
      </div>
    </ReactModal>
  );
};

export default LoginModal;
