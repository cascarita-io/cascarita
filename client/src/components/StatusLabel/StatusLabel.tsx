import styles from "./StatusLabel.module.css";
import { IoMdArrowDropdown } from "react-icons/io";

export interface StatusLabelProps {
  status: "approved" | "rejected" | "pending";
  children: React.ReactNode;
  renderDropdown?: boolean;
}

const statusLabelStyling = (status: string) => {
  return {
    backgroundColor:
      status === "approved"
        ? "#e9ffe8"
        : status === "rejected"
          ? "#ffeeee"
          : "#dbe7f98f",
    color:
      status === "approved"
        ? "#045502"
        : status === "rejected"
          ? "#970303"
          : "#084986",
  };
};

const StatusLabel: React.FC<StatusLabelProps> = ({
  status,
  children,
  renderDropdown = false,
}) => {
  return (
    <p style={statusLabelStyling(status)} className={styles.statusLabel}>
      {children}
      {renderDropdown && <IoMdArrowDropdown />}
    </p>
  );
};

export default StatusLabel;
