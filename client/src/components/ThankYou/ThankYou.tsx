import styles from "./ThankYou.module.css";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {

  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  // TODO: Fix navigation on handleViewForm
  const handleViewForm = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        {/* Awesome checkmark logo time */}
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Purple Circle */}
          <circle cx="50" cy="50" r="50" fill="#3B49DF" />
          {/* White Check */}
          <path
            d="M30 55 L45 70 L70 40"
            stroke="#fff"
            stroke-width="8"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1 className={styles.title}>Completed!</h1>
      <p className={styles.message}>You have successfully created a new form.</p>
      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleViewForm}>
          View Form
        </button>
        <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ThankYou;