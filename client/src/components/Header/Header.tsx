import { Text } from "@radix-ui/themes";

import CascaritaDefault from "../../assets/Logos/CascaritaLogo/CascaritaDefault";
import LanguagePreferenceButton from "../LanguagePreferenceButton/LanguagePreferenceButton";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <CascaritaDefault />

        <span className={styles.logoText}>
          <Text>cascarita</Text>
        </span>
      </div>

      <div className={styles.settingsContainer}>
        <LanguagePreferenceButton className={styles.settingsBtn} />
      </div>
    </header>
  );
};
export default Header;
