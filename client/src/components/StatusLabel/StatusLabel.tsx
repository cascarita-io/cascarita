import styles from "./StatusLabel.module.css";

export interface StatusLabelProps {
  status: "Completed" | "Rejected" | "Restricted" | "Enabled" | string;
  children: React.ReactNode;
}

const StatusLabel: React.FC<StatusLabelProps> = ({ status, children }) => {
  return (
    <p style={statusLabelStyling(status)} className={styles.statusLabel}>
      {children}
    </p>
  );
};

const statusLabelStyling = (status: string) => {
  let label = "";
  switch (status) {
    case "Completed":
    case "Enabled":
      label = "approved";
      break;

    case "Rejected":
    case "Restricted":
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
