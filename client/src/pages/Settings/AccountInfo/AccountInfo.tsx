import styles from "../Settings.module.css";
import { Avatar } from "@radix-ui/themes";
import { FaCopy, FaUser } from "react-icons/fa";
import { useGetCompleteUserSettings } from "../../../api/users/query";
import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import { User } from "../../Users/types";
import { fetchUser } from "../../../api/users/service";

const AccountInfo = () => {
  // State variables
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const textBoxRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (textBoxRef.current) {
      const text = textBoxRef.current.innerText;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 5000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const email = Cookies.get("email") || "";
      const currentUser = await fetchUser(email, token);
      setCurrentUser(currentUser);
    })();
  }, []);

  const userId = currentUser?.id;
  const { data: user } = useGetCompleteUserSettings(userId ? userId : 0);
  const userFullName = `${user?.first_name} ${user?.last_name}`;

  return (
    <section className={styles.settingsWrapper}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrapper}>
          <h2>Your Profile</h2>
          <p>Cascarita Account Information</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3>Group Code</h3>
            <div className={styles.shareContainer}></div>
            {copied ? (
              <p className={styles.copiedMessage}>Copied to clipboard!</p>
            ) : (
              <p className={styles.groupCodeText} ref={textBoxRef}>
                {user?.group_code}
              </p>
            )}
            <button
              className={`${styles.btn} ${styles.copyBtn}`}
              onClick={handleCopy}
            >
              <FaCopy style={{ height: "16px", width: "16px" }} />
            </button>
          </div>
        </div>
        <Avatar
          src={user && user.user_picture}
          fallback={
            <div className={styles.avatarFallback}>
              {user && userFullName ? getInitials(userFullName) : <FaUser />}
            </div>
          }
          size={"7"}
          radius="full"
          className={styles.avatar}
        />
      </div>

      <div className={styles.accountTable}>
        <div className={styles.accountTableRow}>
          <h3>Full Name</h3>
          <p>{user && userFullName}</p>
        </div>

        <div className={styles.accountTableRow}>
          <h3>Email</h3>
          <p>{user && user.email}</p>
        </div>

        <div className={styles.accountTableRow}>
          <h3>Role</h3>
          <p>{user?.role}</p>
        </div>
        <div className={styles.accountTableRow}></div>
      </div>
    </section>
  );
};

// Helper function to get initials from user's name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2); // Limit to 2 characters
};

export default AccountInfo;
