import { HomePageLogoIcon } from "../../assets/Icons";
import styles from "./TopNav.module.css";
import { Text } from "@radix-ui/themes";
import { Avatar } from "@radix-ui/themes";
import { useAuth0 } from "@auth0/auth0-react";
import LanguagePreferenceButton from "../LanguagePreferenceButton/LanguagePreferenceButton";

const SideNav = () => {
  const { user } = useAuth0();

  return (
    <div className={styles["top-nav"]}>
      <div className={styles["logo-con"]}>
        <span className={styles.logo}>
          <HomePageLogoIcon />
        </span>
        <span className={styles["logo-text"]}>
          <Text>cascarita</Text>
        </span>
      </div>
      <div className={styles["search-alert-con"]}>
        <div className={styles.language}>
          <LanguagePreferenceButton />
        </div>
        <div className={styles.avatarCard}>
          <Avatar
            src={user && user.picture}
            fallback="A"
            radius="full"
            className={styles.avatar}
          />

          <Text as="div" size="1" weight="bold" className={styles.avatarText}>
            {user && user.name}
          </Text>
        </div>
      </div>
    </div>
  );
};
export default SideNav;
