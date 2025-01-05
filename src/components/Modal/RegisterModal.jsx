"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../utils/auth";
import { useEffect } from "react";
import { updateProfile } from "firebase/auth";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  name: yup.string().required("Please enter your name"),
});

const RegisterModal = ({ onClose }) => {
  const { register, loading, auth } = useAuth();
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await firebaseRegister(data.email, data.password);

      if (!userCredential || !userCredential.user) {
        throw new Error("Registration failed.");
      }

      console.log("User registered:", userCredential);

      if (auth && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.name });
        console.log("Profile updated successfully!");
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

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape); // Слушаем события на window

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...registerForm("email")} type="email" placeholder="Email" />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}

          <input
            {...registerForm("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

          <input {...registerForm("name")} type="text" placeholder="Name" />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
          <button type="submit">Register</button>
        </form>
      </div>
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный фон */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000; /* Чтобы модалка была поверх всего */
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px; /* Ограничиваем ширину */
          width: 90%; /* Адаптивность */
          position: relative;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          border: none;
          background: none;
          font-size: 1.2em;
        }

        .error-message {
          color: red;
          font-size: 0.8em;
          margin-top: 5px;
        }

        input {
          width: calc(100% - 22px);
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        button[type="submit"] {
          background-color: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default RegisterModal;
