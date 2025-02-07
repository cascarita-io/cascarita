import styles from "./Header.module.css";
import { Text } from "@radix-ui/themes";
import { Avatar } from "@radix-ui/themes";
import { useAuth0 } from "@auth0/auth0-react";
import LanguagePreferenceButton from "../LanguagePreferenceButton/LanguagePreferenceButton";
import cascaritaDefault from "../../assets/Logos/CascaritaLogo/cascarita_default.svg";

const Header = () => {
  const { user } = useAuth0();

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={cascaritaDefault} alt="Cascarita Logo" />

        <span className={styles.logoText}>
          <Text>cascarita</Text>
        </span>
      </div>

      <div className={styles.settingsContainer}>
        <LanguagePreferenceButton className={styles.settingsBtn} />

        <Avatar
          src={user && user.picture}
          fallback="A"
          radius="full"
          className={`${styles.settingsBtn} ${styles.avatar}`}
        />
      </div>
    </header>
  );
};
export default Header;
