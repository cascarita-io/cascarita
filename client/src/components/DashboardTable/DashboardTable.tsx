import React from "react";

import styles from "./DashboardTable.module.css";

interface TableProps {
  headers: string[];
  headerColor?: "light" | "strong" | string;
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
      ? "rgb(234 237 250)"
      : headerColor === "strong"
        ? "#D9D9D9"
        : headerColor;

  return (
    <div className={styles.tableContainer}>
      <table className={tableStyles}>
        <thead
          style={{
            position: "sticky",
            top: 0,
            background: headColor,
          }}>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className={styles.header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={styles.tableBody}>{children}</tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
