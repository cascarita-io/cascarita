import { useNavigate } from "react-router-dom";

import { Text } from "@radix-ui/themes";

import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.notFoundContainer}>
      <Text className={styles.number}>{404}</Text>
      <Text className={styles.notFoundMainTitle}>Something went wrong.</Text>
      <Text className={styles.notFoundSecondaryTitle}>
        Sorry, we can&apos;t find the page you&apos;re looking for.
      </Text>
      <PrimaryButton
        className={styles.redirectButton}
        onClick={() => navigate("/")}>
        Back to Homepage
      </PrimaryButton>
    </div>
  );
}
