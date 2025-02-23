import styles from "./ThankYou.module.css";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {

  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  // TODO: Fix navigation on handleViewForm
  const handleViewForm = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <svg width="40" height="40" viewBox="0 0 24 24">
          <path
            d="M20.285 6.708a1 1 0 0 0-1.414 0L9 16.58l-3.871-3.87a1 1 0 0 0-1.414 1.414l4.578 4.578a1 1 0 0 0 1.414 0l10.578-10.58a1 1 0 0 0 0-1.414z"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
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