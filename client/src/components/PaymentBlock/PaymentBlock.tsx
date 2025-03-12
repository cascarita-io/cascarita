import React from "react";
import styles from "./PaymentBlock.module.css";

interface PaymentBlockProps {
  enabled: boolean;
  className?: string;
  children: React.ReactNode;
}

const PaymentBlock: React.FC<PaymentBlockProps> = ({
  enabled,
  className,
  children,
}) => {
  return (
    <div
      className={`${styles.paymentBlockContainer} ${
        enabled ? styles.enabled : styles.disabled
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default PaymentBlock;
