import React from "react";
import styles from "./RegistrationModal.module.css";
import { Link } from "react-router-dom";

interface TCRegistrationProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

const TCRegistration: React.FC<TCRegistrationProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <>
      <div className={styles.tcContainer}>
        <h1>Terms of Service and Privacy Policy</h1>

        <div className={styles.tcContainer}>
          <p>
            At Cascarita, we strive to make your data our biggest priority. We
            keep it safe. Please read over our{" "}
            <Link to="/terms" target="_blank" rel="noopener noreferrer">
              terms of service
            </Link>{" "}
            and our{" "}
            <Link to="/privacy" target="_blank" rel="noopener noreferrer">
              privacy policy
            </Link>{" "}
            to better acquaint yourself with our services and how we use and
            collect your data.
          </p>

          <div className={styles.tcInputContainer}>
            <input
              type="checkbox"
              checked={value}
              onChange={(event) => onValueChange(event.target.checked)}
            />
            <p>I agree to the Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TCRegistration;
