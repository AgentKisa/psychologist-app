import styles from "./PsychologistCard.module.css";

const PsychologistCard = ({ psychologist }) => {
  return (
    <div className={styles.card}>
      <img
        src={psychologist.avatar_url}
        alt={psychologist.name}
        className={styles.avatar}
      />
      <div className={styles.info}>
        <h2 className={styles.name}>{psychologist.name}</h2>
        <p className={styles.experience}>
          Experience: {psychologist.experience} years
        </p>
        <p className={styles.price}>
          Price per hour: ${psychologist.price_per_hour}
        </p>
        <div className={styles.rating}>
          <span className={styles.ratingStars}>
            {/* Stars will be added here */}
          </span>
          <span className={styles.ratingValue}>
            Rating: {psychologist.rating}
          </span>
        </div>
        <p className={styles.specialization}>
          Specialization: {psychologist.specialization}
        </p>
        <p className={styles.about}>{psychologist.about}</p>
      </div>
    </div>
  );
};

export default PsychologistCard;
