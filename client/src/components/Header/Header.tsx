import styles from "./Header.module.css";
import { Text } from "@radix-ui/themes";
import { Avatar } from "@radix-ui/themes";
// import { useAuth0 } from "@auth0/auth0-react";
import LanguagePreferenceButton from "../LanguagePreferenceButton/LanguagePreferenceButton";
import cascaritaDefault from "../../assets/Logos/CascaritaLogo/cascarita_default.svg";

const Header = () => {
  //TODO: We need to import profile pic to place in Avatar component
  // const { user } = useAuth0();

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
          src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
          fallback="A"
          radius="full"
          className={`${styles.settingsBtn} ${styles.avatar}`}
        />
      </div>
    </header>
  );
};
export default Header;
