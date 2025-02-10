import React from "react";
import styles from "./DashboardTable.module.css";

interface TableProps {
  headers: string[];
  headerColor?: "light" | "strong";
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}

const DashboardTable: React.FC<TableProps> = ({
  headers,
  headerColor,
  children,
  className,
}) => {
  const tableStyles = `${styles.table} ${className}`;
  const headColor =
    headerColor === "light"
      ? "#F4F7FB"
      : headerColor === "strong"
        ? "gray"
        : "";

  return (
    <div className={styles.tableContainer}>
      <table className={tableStyles}>
        <thead>
          <tr>
            {headers.map((header, idx) => {
              return (
                <th
                  key={idx}
                  className={styles.header}
                  style={{ backgroundColor: headColor }}
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className={styles.tableBody}>{children}</tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
