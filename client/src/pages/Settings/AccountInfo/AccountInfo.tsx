import styles from "../Settings.module.css";
import { Avatar } from "@radix-ui/themes";
import { useAuth0 } from "@auth0/auth0-react";

const AccountInfo = () => {
  const { user } = useAuth0();
  return (
    <section className={styles.settingsWrapper}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrapper}>
          <h2>Your Profile</h2>
          <p>Cascarita Account Information</p>
        </div>
        <Avatar
          src={user && user.picture}
          fallback="fallback"
          size={"7"}
          radius="full"
          className={styles.avatar}
        />
      </div>

      <div className={styles.accountTable}>
        <div className={styles.accountTableRow}>
          <h3>Full Name</h3>
          {/* <p>John</p> */}
          <p>{user && user.name}</p>
        </div>

        <div className={styles.accountTableRow}>
          <h3>Email</h3>
          <p>{user && user.email}</p>
        </div>

        <div className={styles.accountTableRow}>
          <h3>Role</h3>
          {/* TODO: Add role info from Auth0  */}
          <p>Player</p>
        </div>
      </div>
    </section>
  );
};

export default AccountInfo;
