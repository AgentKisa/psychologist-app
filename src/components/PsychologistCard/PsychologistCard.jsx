import React from "react";
import styles from "./PsychologistCard.module.css";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAuth } from "@/utils/auth";

const PsychologistCard = ({
  psychologist,
  isExpanded,
  onExpand,
  isFavorite,
  toggleFavorite,
  onOpenModal,
}) => {
  const { user } = useAuth();
  const handleToggleFavorite = () => {
    if (!user) {
      toast.warn("This functionality is available only to authorized users.");
      return;
    }
    toggleFavorite(psychologist.id);
  };
  return (
    <article className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.cardImg}>
          <Image
            src={psychologist.avatar_url}
            alt={`Avatar of ${psychologist.name}`}
            className={styles.avatar}
            width={96}
            height={96}
          />
          <svg width="14" height="14">
            <use href="/sprite.svg#icon-Group"></use>
          </svg>
        </div>
        <div className={styles.head}>
          <div className={styles.headTitle}>
            <h2 className={styles.title}>Psychologist</h2>

            <div className={styles.priceRating}>
              <p className={styles.rating}>
                <svg width="16" height="16">
                  <use href="/sprite.svg#icon-star"></use>
                </svg>{" "}
                Rating: {psychologist.rating}
              </p>
              <p className={styles.price}>
                <span className={styles.priceLabel}>Price / 1 hour: </span>
                {psychologist.price_per_hour}$
              </p>
              <button
                className={`${styles.heartButton} ${isFavorite ? styles.filledHeart : ""}`}
                aria-label={
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
                onClick={handleToggleFavorite}
              >
                <svg width="26" height="24">
                  <use
                    href={
                      isFavorite
                        ? "/sprite.svg#icon-Property"
                        : "/sprite.svg#icon-Property"
                    }
                  ></use>
                </svg>
              </button>
            </div>
          </div>
          <p className={styles.name}>{psychologist.name}</p>

          <div className={styles.info}>
            <p className={styles.license}>
              <span className={styles.label}>License:</span>{" "}
              {psychologist.license}
            </p>
            <p className={styles.experience}>
              <span className={styles.label}>Experience:</span>{" "}
              {psychologist.experience} years
            </p>
            <p className={styles.specialization}>
              <span className={styles.label}>Specialization:</span>{" "}
              {psychologist.specialization}
            </p>
            <p className={styles.initialConsultation}>
              <span className={styles.label}>Initial consultation:</span>{" "}
              {psychologist.initial_consultation}
            </p>
          </div>
          <p className={styles.description}>{psychologist.about}</p>

          {!isExpanded && (
            <button
              className={styles.toggleButton}
              onClick={onExpand}
              aria-expanded={isExpanded}
            >
              Read More
            </button>
          )}
          {isExpanded && (
            <section className={styles.details}>
              <ul className={styles.reviewsList}>
                {psychologist.reviews.map((review, index) => (
                  <li key={index} className={styles.review}>
                    <div className={styles.reviewAvatar}>
                      {review.reviewer.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.reviewContent}>
                      <div className={styles.reviewerInfo}>
                        <div className={styles.reviewerNameRating}>
                          <p className={styles.reviewerName}>
                            {review.reviewer}
                          </p>
                          <div className={styles.ratingContainer}>
                            <svg
                              width="16"
                              height="16"
                              className={styles.starIcon}
                            >
                              <use href="/sprite.svg#icon-star"></use>
                            </svg>
                            <span className={styles.ratingValue}>
                              {review.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className={styles.comment}>{review.comment}</p>
                  </li>
                ))}
              </ul>
              <div className={styles.appointment}>
                <button
                  className={styles.appointmentButton}
                  onClick={() => onOpenModal(psychologist)}
                >
                  Make an appointment
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
};

export default PsychologistCard;
