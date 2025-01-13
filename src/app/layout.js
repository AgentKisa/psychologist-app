import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import { AuthProvider } from "@/utils/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Psychologist App",
  description:
    "This project is an application for searching and booking consultations with psychologists.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>
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
