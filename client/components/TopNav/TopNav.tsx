import Logo from "../../assets/logo.svg";
import styles from "./TopNav.module.css";
import { Text } from "@radix-ui/themes";
import { Avatar } from "@radix-ui/themes";
import { MdOutlineNotifications } from "react-icons/md";
import Search from "../Search/Search";
import { useAuth } from "../AuthContext/AuthContext";
import { changeLanguage } from "../../i18n/config";

const SideNav = () => {
  const { currentUser } = useAuth();

  const handleLanguageChange = async (lng: string) => {
    await changeLanguage(lng);
  };

  return (
    <div className={styles["top-nav"]}>
      <div className={styles["logo-con"]}>
        <span className={styles.logo}>
          <Logo />
        </span>
        <span className={styles["logo-text"]}>
          <Text>cascarita</Text>
        </span>
      </div>
      <div className={styles["search-alert-con"]}>
        <div className={styles["button-container"]}>
          <button onClick={() => handleLanguageChange("en")}>English</button>
          <button onClick={() => handleLanguageChange("esp")}>Español</button>
        </div>
        <Search />
        <MdOutlineNotifications className={styles.notification} />
        <div className={styles.avatarCard}>
          <Avatar
            src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
            fallback="A"
            radius="full"
            className={styles.avatar}
          />

          <Text as="div" size="1" weight="bold" className={styles.avatarText}>
            {currentUser && currentUser.email}
          </Text>
        </div>
      </div>
    </div>
  );
};
export default SideNav;
