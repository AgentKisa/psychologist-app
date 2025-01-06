import styles from "./PsychologistCard.module.css";

const PsychologistCard = ({ psychologist, isExpanded, onExpand }) => {
  return (
    <article className={styles.card}>
      <img
        src={psychologist.avatar_url}
        alt={`Avatar of ${psychologist.name}`}
        className={styles.avatar}
      />
      <div className={styles.head}>
        <h2 className={styles.name}>{psychologist.name}</h2>
        <p className={styles.license}>{psychologist.license}</p>
        <p className={styles.experience}>
          Experience: {psychologist.experience}
        </p>
        <p className={styles.specialization}>
          Specialization: {psychologist.specialization}
        </p>
        <p className={styles.price}>
          Price per hour: ${psychologist.price_per_hour}{" "}
          <button className={styles.heartButton} aria-label="Add to Favorites">
            <svg width="26" height="24">
              <use href="/sprite.svg#icon-Property"></use>
            </svg>
          </button>
        </p>
        <p className={styles.rating}>Rating: {psychologist.rating}</p>
        <p className={styles.initialConsultation}>
          {psychologist.initial_consultation}
        </p>
      </div>
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
          <p className={styles.about}>{psychologist.about}</p>
          <h3 className={styles.reviewsTitle}>Reviews:</h3>
          <ul className={styles.reviewsList}>
            {psychologist.reviews.map((review, index) => (
              <li key={index} className={styles.review}>
                <p>
                  <strong>{review.reviewer}</strong> - {review.rating}★
                </p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
          <div className={styles.appointment}>
            <button className={styles.appointmentButton}>
              Make an appointment
            </button>
          </div>
        </section>
      )}
    </article>
  );
};

export default PsychologistCard;
