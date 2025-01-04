// src/components/Home/Home.js
import Image from "next/image";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <section className={styles.home}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h1 className={styles.title}>
            The road to the <span className={styles.highlight}>depths</span> of
            the human soul
          </h1>
          <p className={styles.description}>
            We help you to reveal your potential, overcome challenges, and find
            a guide in your own life with the help of our experienced
            psychologists.
          </p>
          <button className={styles.ctaButton}>
            Get started{" "}
            <svg className={styles.icon} width="18" height="15">
              <use href="/sprite.svg#icon-Arrow-16"></use>
            </svg>
          </button>
        </div>
        <div className={styles.imageBlock}>
          <Image
            className={styles.image}
            src="/img/image-1.jpg"
            alt="Psychologist session"
            width={464}
            height={526}
            priority={true}
          />
        </div>
      </div>
    </section>
  );
}
