"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import RegisterModal from "../Modal/RegisterModal";
import LoginModal from "../Modal/LoginModal";
import { useAuth } from "../../utils/auth";
import { usePathname } from "next/navigation"; // Импортируем usePathname

const Header = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname(); // Используем usePathname

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
            {pathname === "/psychologists" && ( // Условный рендеринг SVG под надписью Psychologists
              <svg className={styles.navIcon} width="8" height="8">
                <use href="/sprite.svg#icon-circle"></use>
              </svg>
            )}
          </Link>
          <Link href="/favorites" className={styles.navLink}>
            Favorites
            {pathname === "/favorites" && ( // Условный рендеринг SVG под надписью Favorites
              <svg className={styles.navIcon} width="8" height="8">
                <use href="/sprite.svg#icon-circle"></use>
              </svg>
            )}
          </Link>
        </nav>
        <div className={styles.authButtons}>
          {!user && (
            <>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={styles.authButton}
              >
                Log In
              </button>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className={styles.authButton2}
              >
                Registration
              </button>
            </>
          )}
          {user && (
            <div className={styles.userSection}>
              <div className={styles.userAvatar}>
                <svg className={styles.navIcon} width="24" height="24">
                  <use href="/sprite.svg#icon-user"></use>
                </svg>
              </div>
              <p className={styles.userName}>{user.displayName || "User"}</p>
              <button onClick={logout} className={styles.authButton}>
                Log out
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
