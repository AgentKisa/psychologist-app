import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import { AuthProvider } from "@/utils/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Psychologist App</title>
        <meta
          name="description"
          content="This project is an application for searching and booking consultations with psychologists."
        />
      </head>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <Header />
          <ToastContainer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
