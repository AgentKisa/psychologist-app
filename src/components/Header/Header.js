"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import RegisterModal from "../Modal/RegisterModal";
import LoginModal from "../Modal/LoginModal";
import { useAuth } from "../../utils/auth";
const Header = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          psychologists.<span className={styles.logoSpan}>services</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/psychologists" className={styles.navLink}>
            Psychologists
          </Link>
          {user && (
            <Link href="/favorites" className={styles.navLink}>
              Favorites
            </Link>
          )}
        </nav>
        <div className={styles.authButtons}>
          {!user && (
            <>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={styles.authButton2}
              >
                Log In
              </button>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className={styles.authButton}
              >
                Registration
              </button>
            </>
          )}
          {user && (
            <div className={styles.userSection}>
              <span className={styles.userName}>
                Welcome, {user.displayName || "User"}
              </span>
              <button onClick={logout} className={styles.authButton}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {isRegisterModalOpen && (
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onRequestClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
