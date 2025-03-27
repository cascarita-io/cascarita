import { Text } from "@radix-ui/themes";

import { HomePageLogoIcon } from "../../assets/Icons";
import ProgressBar from "../ProgressBar/ProgressBar";
import styles from "./FormHeader.module.css";

interface FormHeaderProps {
  used: number;
  total: number;
}

const FormHeader: React.FC<FormHeaderProps> = ({ used, total }) => {
  return (
    <header className={styles.container}>
      <div className={styles.logoCon}>
        <span className={styles.logo}>
          <HomePageLogoIcon />
        </span>
        <span className={styles.logoText}>
          <Text>cascarita</Text>
        </span>
      </div>

      <div className={styles.progressBarContainer}>
        <ProgressBar used={used} total={total} />
      </div>
    </header>
  );
};

export default FormHeader;
