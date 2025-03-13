import styles from "./StatusLabel.module.css";
import { IoMdArrowDropdown } from "react-icons/io";

export interface StatusLabelProps {
  status: "Completed" | "Rejected" | "Restricted" | "Enabled" | string;
  children: React.ReactNode;
  renderDropdown?: boolean;
  className?: string;
}

const StatusLabel: React.FC<StatusLabelProps> = ({
  status,
  children,
  renderDropdown = false,
  className,
}) => {
  const statusLabelStyles = `${styles.statusLabel} ${className}`;
  return (
    <p style={statusLabelStyling(status)} className={statusLabelStyles}>
      {children}
      {renderDropdown && <IoMdArrowDropdown />}
    </p>
  );
};

const statusLabelStyling = (status: string) => {
  let label = "";
  let lowerCaseStatus;
  if (status) {
    lowerCaseStatus = status.toLowerCase();
  } else {
    lowerCaseStatus = status;
  }
  switch (lowerCaseStatus) {
    case "completed":
    case "enabled":
    case "approved":
      label = "approved";
      break;

    case "rejected":
    case "restricted":
      label = "rejected";
      break;

    default:
      label = "pending";
      break;
  }

  return {
    backgroundColor:
      label === "approved"
        ? "#e9ffe8"
        : label === "rejected"
          ? "#ffeeee"
          : "#dbe7f98f",
    color:
      label === "approved"
        ? "#045502"
        : label === "rejected"
          ? "#970303"
          : "#084986",
  };
};

export default StatusLabel;
