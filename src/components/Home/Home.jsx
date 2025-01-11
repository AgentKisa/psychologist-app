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
            We help you to reveal your potential, overcome challenges and find a
            guide in your own life with the help of our experienced
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
          {" "}
          <Image
            className={styles.image}
            src="/img/image-1.jpg"
            alt="Psychologist session"
            width={464}
            height={526}
            priority={true}
          />{" "}
          <div className={styles.statsBox}>
            {" "}
            <div className={styles.iconContainer}>
              {" "}
              <svg width="30" height="30" className={styles.icon2}>
                {" "}
                <use href="/sprite.svg#icon-fe-check"></use>{" "}
              </svg>{" "}
            </div>{" "}
            <div className={styles.textContainer}>
              {" "}
              <p className={styles.statsTitle}>
                Experienced psychologists
              </p>{" "}
              <p className={styles.statsValue}>15,000</p>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.usersBox}>
            {" "}
            <svg width="20" height="20" className={styles.usersIcon}>
              {" "}
              <use href="/sprite.svg#icon-users"></use>{" "}
            </svg>{" "}
          </div>{" "}
          <div className={styles.questionBox}>
            {" "}
            <svg width="10" height="17" className={styles.questionIcon}>
              {" "}
              <use href="/sprite.svg#icon-question"></use>{" "}
            </svg>{" "}
          </div>{" "}
        </div>
      </div>
    </section>
  );
}
