import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@radix-ui/themes";
import Cookies from "js-cookie";

import styles from "./LogoutButton.module.css";
import { LogoutButtonProps } from "./types";

const LogoutButton: React.FC<LogoutButtonProps> = ({
  icon,
  label,
  className,
}) => {
  const { logout } = useAuth0();
  const btnStyles = `${styles.button} ${className}`;
  return (
    <Button
      onClick={() => {
        logout();
        Cookies.remove("email");
      }}
      variant="soft"
      className={btnStyles}>
      <span>{icon}</span>
      <span>{label}</span>
    </Button>
  );
};
export default LogoutButton;
