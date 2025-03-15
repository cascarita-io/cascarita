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
  let label: keyof typeof colorTokens = "pending";
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
    case "expired":
      label = "expired";
      break;

    default:
      label = "pending";
      break;
  }

  const colorTokens = {
    approved: {
      backgroundColor: "#e9ffe8",
      color: "#045502",
    },
    rejected: {
      backgroundColor: "#ffeeee",
      color: "#970303",
    },
    expired: {
      backgroundColor: "#fff5e6",
      color: "#b36b00",
    },
    pending: {
      backgroundColor: "#dbe7f98f",
      color: "#084986",
    },
  };

  return colorTokens[label];
};

export default StatusLabel;
